import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    age: "", sex: "", cp: "", trestbps: "",
    chol: "", fbs: "", restecg: "", thalach: "",
    exang: "", oldpeak: "", slope: "", ca: "", thal: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const features = Object.values(formData).map(Number);
    const response = await fetch("https://heart-disease-predictor-h9do.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features })
    });
    const data = await response.json();
    setResult(data);
    setLoading(false);
  };

  const fields = [
    { name: "age", label: "Age" },
    { name: "sex", label: "Sex (0=Female, 1=Male)" },
    { name: "cp", label: "Chest Pain Type (0-3)" },
    { name: "trestbps", label: "Resting Blood Pressure" },
    { name: "chol", label: "Cholesterol" },
    { name: "fbs", label: "Fasting Blood Sugar > 120mg (0/1)" },
    { name: "restecg", label: "Resting ECG (0-2)" },
    { name: "thalach", label: "Max Heart Rate" },
    { name: "exang", label: "Exercise Induced Angina (0/1)" },
    { name: "oldpeak", label: "ST Depression" },
    { name: "slope", label: "Slope (0-2)" },
    { name: "ca", label: "Major Vessels (0-4)" },
    { name: "thal", label: "Thalassemia (0-3)" }
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>❤️ Heart Disease Predictor</h1>
      <p style={styles.subtitle}>Enter patient clinical data to assess heart disease risk</p>

      <div style={styles.form}>
        {fields.map((field) => (
          <div key={field.name} style={styles.fieldGroup}>
            <label style={styles.label}>{field.label}</label>
            <input
              type="number"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter value"
            />
          </div>
        ))}

        <button
          onClick={handleSubmit}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Predict"}
        </button>
      </div>

      {result && (
        <div style={{
          ...styles.result,
          backgroundColor: result.prediction === 1 ? "#ffe5e5" : "#e5ffe5",
          borderColor: result.prediction === 1 ? "#ff4444" : "#44bb44"
        }}>
          <h2 style={styles.resultTitle}>
            {result.prediction === 1 ? "⚠️ Heart Disease Detected" : "✅ No Heart Disease Detected"}
          </h2>
          <p style={styles.probability}>
            Risk Probability: <strong>{result.probability}%</strong>
          </p>
          <p style={styles.advice}>
            {result.prediction === 1
              ? "Please consult a cardiologist immediately."
              : "Patient appears healthy. Continue regular checkups."}
          </p>
        </div>
      )}

      <div style={styles.insights}>
        <h2 style={styles.insightsTitle}>📊 Model Insights</h2>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Feature Correlation Matrix</h3>
          <img
            src="https://heart-disease-predictor-h9do.onrender.com/static/correlation.png"
            alt="Correlation Heatmap"
            style={styles.chart}
          />
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Feature Importance</h3>
          <img
            src="https://heart-disease-predictor-h9do.onrender.com/static/feature_importance.png"
            alt="Feature Importance"
            style={styles.chart}
          />
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Confusion Matrix</h3>
          <img
            src="https://heart-disease-predictor-h9do.onrender.com/static/confusion_matrix.png"
            alt="Confusion Matrix"
            style={styles.chart}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    fontFamily: "Segoe UI, sans-serif",
    padding: "20px"
  },
  title: {
    textAlign: "center",
    color: "#c0392b",
    fontSize: "2rem"
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "30px"
  },
  form: {
    backgroundColor: "#f9f9f9",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },
  fieldGroup: {
    marginBottom: "16px"
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#333"
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box"
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#c0392b",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px"
  },
  result: {
    marginTop: "30px",
    padding: "24px",
    borderRadius: "12px",
    border: "2px solid",
    textAlign: "center"
  },
  resultTitle: {
    fontSize: "1.5rem",
    marginBottom: "10px"
  },
  probability: {
    fontSize: "1.1rem",
    marginBottom: "8px"
  },
  advice: {
    color: "#555"
  },
  insights: {
    marginTop: "50px"
  },
  insightsTitle: {
    textAlign: "center",
    color: "#2c3e50",
    fontSize: "1.5rem",
    marginBottom: "20px"
  },
  chartCard: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "30px"
  },
  chartTitle: {
    color: "#333",
    marginBottom: "15px",
    fontSize: "1rem"
  },
  chart: {
    width: "100%",
    borderRadius: "8px"
  }
};

export default App;