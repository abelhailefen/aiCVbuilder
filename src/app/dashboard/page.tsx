"use client"

import { useState } from "react"
import styles from '../../styles/dashboard.module.css';

export default function Dashboard() {
  const [personalInfo, setPersonalInfo] = useState({ name: "", email: "", phone: "", address: "" })
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState("")
  const [summary, setSummary] = useState("")
  const [sections, setSections] = useState([])
  const [sectionTitle, setSectionTitle] = useState("")
  const [sectionContent, setSectionContent] = useState("")
  const [loading, setLoading] = useState(false);

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value })
  }

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...skills]
    updatedSkills.splice(index, 1)
    setSkills(updatedSkills)
  }

  const handleAddSection = () => {
    if (sectionTitle && sectionContent) {
      setSections([...sections, { title: sectionTitle, content: sectionContent }])
      setSectionTitle("")
      setSectionContent("")
    }
  }

  const handleRemoveSection = (index) => {
    const updatedSections = [...sections]
    updatedSections.splice(index, 1)
    setSections(updatedSections)
  }
 const handleGenerateSummary = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: personalInfo.name, skills }),
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
    }
    setLoading(false);
  };
  const generateSummary = async () => {
    if (!personalInfo.name || skills.length === 0) {
      alert('Please enter your name and at least one skill.');
      return;
    }
  
    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: personalInfo.name, skills }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSummary(data.summary);
      } else {
        alert(data.error || 'Failed to generate summary.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while generating the summary.');
    }
  }; 
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Resume Builder</h1>
        <button onClick={generateSummary} className={styles.button} >Save Resume</button>
      </div>

      {/* Personal Information */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Personal Information</h2>
          <p className={styles.cardDescription}>Add your contact details and basic information</p>
        </div>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="name">
              Full Name
            </label>
            <input
              className={styles.input}
              id="name"
              name="name"
              placeholder="John Doe"
              value={personalInfo.name}
              onChange={handlePersonalInfoChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              className={styles.input}
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={personalInfo.email}
              onChange={handlePersonalInfoChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="phone">
              Phone
            </label>
            <input
              className={styles.input}
              id="phone"
              name="phone"
              type="tel"
              placeholder="(123) 456-7890"
              value={personalInfo.phone}
              onChange={handlePersonalInfoChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="address">
              Address
            </label>
            <input
              className={styles.input}
              id="address"
              name="address"
              placeholder="123 Main St, City, State"
              value={personalInfo.address}
              onChange={handlePersonalInfoChange}
            />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Professional Summary</h2>
          <p className={styles.cardDescription}>Write a compelling summary of your professional background</p>
        </div>
        <div className={styles.formGroup}>
          <textarea
            className={styles.textarea}
            placeholder="Experienced professional with a track record of..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
      </div>

      {/* Skills */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Skills</h2>
          <p className={styles.cardDescription}>Add your technical and professional skills</p>
        </div>
        <div className={styles.formGroup}>
          <div className={styles.flexRow}>
            <input
              className={`${styles.input} ${styles.inputFlex}`}
              placeholder="Add a skill (e.g., JavaScript, Project Management)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
            />
            <button className={styles.button} onClick={handleAddSkill}>
              Add Skill
            </button>
          </div>

          {skills.length > 0 && (
            <div className={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <div key={index} className={styles.skillTag}>
                  {skill}
                  <button
                    className={styles.iconButton}
                    onClick={() => handleRemoveSkill(index)}
                    title={`Remove ${skill}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Additional Sections */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Additional Sections</h2>
          <p className={styles.cardDescription}>Add custom sections like Education, Experience, or Projects</p>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="section-title">
            Section Title
          </label>
          <input
            className={styles.input}
            id="section-title"
            placeholder="e.g., Work Experience, Education"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="section-content">
            Section Content
          </label>
          <textarea
            className={styles.textarea}
            id="section-content"
            placeholder="Describe your experiences, education, or other relevant information"
            value={sectionContent}
            onChange={(e) => setSectionContent(e.target.value)}
          />
        </div>
        <button className={styles.button} onClick={handleAddSection}>
          Add Section
        </button>
      </div>

      {/* Rendered Sections */}
      {sections.length > 0 && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Your Custom Sections</h2>
          </div>
          {sections.map((section, index) => (
            <div key={index} className={styles.sectionItem}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>{section.title}</h3>
                <button className={styles.iconButton} onClick={() => handleRemoveSection(index)} title="Remove section">
                  ✕
                </button>
              </div>
              <div className={styles.separator}></div>
              <p className={styles.sectionContent}>{section.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

