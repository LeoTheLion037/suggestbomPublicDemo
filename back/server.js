require('dotenv').config();
const axios = require('axios');

// debug line
console.log('Claude API Key loaded:', process.env.CLAUDE_API_KEY ? 'YES' : 'NO');

const express = require('express');
const cors = require('cors');
const { exec, execFile } = require('child_process');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const unzipper = require('unzipper');
const multer = require('multer');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3001;

// File upload setup
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.static('front'));

// True = AI Enabled
// False = AI Disabled
const AIToggle = false;

// Connects to IO socket of front end
io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });


// Connects server to the React App frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'front/build')));

    // Handle all other routes by serving the index.html from the React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'front', 'build', 'index.html'));
    });
}


// This function runs a command stored in function parameter
// and returns the output once the command has completed
// This is used for executing Syft and Grype
function execPromise(command, options = {}) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            // If there's stderr but no error, it might just be warnings
            if (stderr && !error) {
                console.log('Command warnings:', stderr);
                resolve(stdout);
                return;
            }
            
            // If there's an error, check if it's critical
            if (error) {
                // For Syft/Grype, warnings don't cause exit code errors
                // But if they do, check if we still got useful output 
                if (stdout && stderr.includes('WARN') && !stderr.includes('ERROR')) {
                    console.log('Command completed with warnings:', stderr);
                    resolve(stdout);
                    return;
                }
                reject({ error, stderr });
            } else {
                resolve(stdout);
            }
        });
    });
}

// Claude analysis function
async function analyzeWithClaude(sbomData, grypeData) {
    const prompt = `You are a cybersecurity expert. Analyze this SBOM and vulnerability data and provide actionable remediation steps.

SBOM DATA:
${sbomData}

VULNERABILITY DATA:
${grypeData}

Please provide:
1. Critical vulnerabilities requiring immediate attention
2. Specific remediation steps with commands
3. Priority timeline for fixes

Format with clear headings and actionable steps.`;

    try {
        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: "claude-sonnet-4-20250514",
            max_tokens: 4000,
            messages: [{ role: "user", content: prompt }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            }
        });

        return response.data.content[0].text;
    } catch (error) {
        throw new Error(`Claude API error: ${error.message}`);
    }
}

// accepts a zip file, extracts, runs syft & grype, and then runs through AI Model
app.post('/runAnalysis', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    if (!req.file.mimetype.includes('zip')) {
        return res.status(400).json({ error: 'Only .zip files are supported' });
    }

    const zipPath = req.file.path;
    const extractDir = `uploads/${Date.now()}_extracted`;

    try {
        console.log('🔍 ZIP received at:', zipPath);

        // Extract ZIP to temp folder with proper error handling
        await new Promise((resolve, reject) => {
            const stream = fs.createReadStream(zipPath)
                .pipe(unzipper.Extract({ path: extractDir }));
            
            stream.on('close', resolve);
            stream.on('error', reject);
            stream.on('finish', resolve);
        });

        console.log('✅ Extracted to:', extractDir);

        // Verify extraction worked
        if (!fs.existsSync(extractDir)) {
            throw new Error('Extraction failed - directory not created');
        }

        // Run Syft and Grype on the extracted directory
        console.log('🔍 Running Syft...');
        const sbom = await execPromise(`syft dir:${extractDir} -o json`);
        
        console.log('🛡️ Running Grype...');
        const vulnerabilities = await execPromise(`grype dir:${extractDir} -o json`);

        console.log('✅ Syft and Grype scan completed.');

        let claudeAnalysis;

        if(AIToggle == true){
            console.log('🤖 Analyzing with Claude...');
            claudeAnalysis = await analyzeWithClaude(sbom, vulnerabilities);
        }else{
            console.log('🤖 AI Recommendations Diasbled');
            claudeAnalysis = 'AI Recommendations Diasbled';
        }

        // console.log('🤖 Analyzing with Claude...');
        // const claudeAnalysis = await analyzeWithClaude(sbom, vulnerabilities);

        res.status(200).json({
            sbom,
            vulnerabilities,
            message: 'Security analysis complete',
            target: extractDir,
            analysis: claudeAnalysis
        });
    } catch (err) {
        console.error('❌ Full error object:', err);
        console.error('❌ Error message:', err.message);
        console.error('❌ Error type:', typeof err);
        
        res.status(500).json({ 
            error: 'Failed to process uploaded ZIP with Syft/Grype',
            details: err.message || 'Unknown error occurred'
        });
    } finally {
        // remove uploaded ZIP and extracted files
        try {
            fsExtra.removeSync(zipPath);
            fsExtra.removeSync(extractDir);
        } catch (cleanupErr) {
            console.error('Cleanup error:', cleanupErr);
        }
    }
});

