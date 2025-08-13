import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Upload, Play, FileText, Shield, Target, CheckCircle } from 'lucide-react';

function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    sbom: false,
    vulnerabilities: false,
    analysis: false
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(''); // Clear any previous errors
  };

  const runAnalysis = async () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://localhost:3001/runAnalysis', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      setResult(data);
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    header: {
      backgroundColor: '#dc2626',
      color: 'white',
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '48px 24px',
      textAlign: 'center'
    },
    mainTitle: {
      fontSize: '3rem',
      fontWeight: '700',
      margin: 0,
      letterSpacing: '-0.025em'
    },
    subtitle: {
      color: '#fecaca',
      fontSize: '1.25rem',
      marginTop: '12px',
      margin: 0,
      fontWeight: '400'
    },
    mainContent: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '48px 24px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '40px',
      marginBottom: '32px',
      border: '1px solid #e2e8f0'
    },
    sectionTitle: {
      fontSize: '1.75rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '32px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    uploadArea: {
      border: '2px dashed #cbd5e1',
      borderRadius: '12px',
      padding: '48px 32px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '32px',
      backgroundColor: '#f8fafc'
    },
    uploadAreaHover: {
      borderColor: '#dc2626',
      backgroundColor: '#fef2f2'
    },
    fileInput: {
      display: 'none'
    },
    uploadIcon: {
      backgroundColor: '#fef2f2',
      borderRadius: '50%',
      padding: '20px',
      display: 'inline-flex',
      marginBottom: '20px',
      border: '1px solid #fecaca'
    },
    uploadText: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 8px 0'
    },
    uploadSubtext: {
      fontSize: '1rem',
      color: '#64748b',
      margin: 0
    },
    buttonContainer: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    runButton: {
      padding: '14px 32px',
      backgroundColor: '#dc2626',
      color: 'white',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)'
    },
    runButtonDisabled: {
      backgroundColor: '#94a3b8',
      cursor: 'not-allowed',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    runButtonLoading: {
      backgroundColor: '#059669',
      cursor: 'default'
    },
    errorBox: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '24px'
    },
    errorText: {
      color: '#dc2626',
      fontWeight: '600',
      margin: 0,
      fontSize: '1rem'
    },
    successBox: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    successText: {
      color: '#059669',
      fontWeight: '600',
      margin: 0,
      fontSize: '1rem'
    },
    dropdownContainer: {
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      marginBottom: '20px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    },
    dropdownHeader: {
      width: '100%',
      padding: '20px 24px',
      color: 'white',
      fontWeight: '600',
      fontSize: '1.125rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    dropdownContent: {
      backgroundColor: '#f8fafc',
      borderTop: '1px solid #e2e8f0'
    },
    dropdownPre: {
      padding: '24px',
      fontSize: '0.9rem',
      fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
      color: '#334155',
      whiteSpace: 'pre-wrap',
      overflowX: 'auto',
      maxHeight: '500px',
      overflowY: 'auto',
      margin: 0,
      lineHeight: '1.6'
    },
    loadingSpinner: {
      width: '20px',
      height: '20px',
      border: '2px solid #ffffff40',
      borderTop: '2px solid #ffffff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  const DropdownSection = ({ title, content, icon: Icon, isExpanded, onToggle, bgColor }) => (
    <div style={styles.dropdownContainer}>
      <button
        onClick={onToggle}
        style={{
          ...styles.dropdownHeader,
          backgroundColor: bgColor
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0px)'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Icon size={22} />
          <span>{title}</span>
        </div>
        {isExpanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
      </button>
      {isExpanded && (
        <div style={styles.dropdownContent}>
          <pre style={styles.dropdownPre}>
            {content || 'No data available'}
          </pre>
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.mainTitle}>SuggestBOM</h1>
          <p style={styles.subtitle}>
            Security Analysis & Vulnerability Assessment Tool
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Upload Section */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>
            <Upload color="#dc2626" size={28} />
            Upload ZIP File for Analysis
          </h2>
          
          <div>
            <div 
              style={styles.uploadArea}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#dc2626';
                e.target.style.backgroundColor = '#fef2f2';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.backgroundColor = '#f8fafc';
              }}
            >
              <input
                type="file"
                id="fileUpload"
                onChange={handleFileChange}
                accept=".zip"
                style={styles.fileInput}
              />
              <label
                htmlFor="fileUpload"
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
              >
                <div style={styles.uploadIcon}>
                  <FileText color="#dc2626" size={36} />
                </div>
                <div>
                  <p style={styles.uploadText}>
                    {file ? file.name : 'Choose a ZIP file to upload'}
                  </p>
                  <p style={styles.uploadSubtext}>
                    Click here to browse and select your file
                  </p>
                </div>
              </label>
            </div>

            <div style={styles.buttonContainer}>
              
              <button
                onClick={runAnalysis}
                disabled={!file || isLoading}
                style={{
                  ...styles.runButton,
                  ...(file && !isLoading ? {} : styles.runButtonDisabled),
                  ...(isLoading ? styles.runButtonLoading : {})
                }}
                onMouseEnter={(e) => {
                  if (file && !isLoading) {
                    e.target.style.backgroundColor = '#b91c1c';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (file && !isLoading) {
                    e.target.style.backgroundColor = '#dc2626';
                    e.target.style.transform = 'translateY(0px)';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div style={styles.loadingSpinner}></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Run Analysis
                  </>
                )}
              </button>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <p style={styles.errorText}>{error}</p>
              </div>
            )}

            {result && !error && (
              <div style={styles.successBox}>
                <CheckCircle color="#059669" size={24} />
                <p style={styles.successText}>Analysis completed successfully!</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              <Target color="#dc2626" size={28} />
              Analysis Results
            </h2>
            
            <div>
              {result.sbom && (
                <DropdownSection
                  title="SBOM (Software Bill of Materials)"
                  content={result.sbom}
                  icon={FileText}
                  isExpanded={expandedSections.sbom}
                  onToggle={() => toggleSection('sbom')}
                  bgColor="#2563eb"
                />
              )}

              {result.vulnerabilities && (
                <DropdownSection
                  title="Vulnerability Scan Results"
                  content={result.vulnerabilities}
                  icon={Shield}
                  isExpanded={expandedSections.vulnerabilities}
                  onToggle={() => toggleSection('vulnerabilities')}
                  bgColor="#ea580c"
                />
              )}

              {result.analysis && (
                <DropdownSection
                  title="Security Analysis & Recommendations"
                  content={result.analysis}
                  icon={Target}
                  isExpanded={expandedSections.analysis}
                  onToggle={() => toggleSection('analysis')}
                  bgColor="#16a34a"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;