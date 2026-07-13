import pandas as pd
import numpy as np
import os
import pickle
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix

# Setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'static')
os.makedirs(STATIC_DIR, exist_ok=True)
print("Saving images to:", STATIC_DIR)

# Load data
df = pd.read_csv(os.path.join(BASE_DIR, 'heart.csv'))
df.fillna(df.median(), inplace=True)

X = df.drop('target', axis=1)
y = df['target']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

# Train Logistic Regression
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.5f}")

# Plot 1 - Correlation Heatmap
fig, ax = plt.subplots(figsize=(12, 8))
sns.heatmap(df.corr(), annot=True, fmt='.2f', cmap='coolwarm', ax=ax)
ax.set_title('Feature Correlation Matrix')
fig.tight_layout()
path1 = os.path.join(STATIC_DIR, 'correlation.png')
fig.savefig(path1)
plt.close(fig)
print("Correlation saved:", os.path.exists(path1))

# Plot 2 - Confusion Matrix
fig, ax = plt.subplots(figsize=(6, 4))
sns.heatmap(confusion_matrix(y_test, y_pred),
            annot=True, fmt='d', cmap='Blues', ax=ax)
ax.set_title('Confusion Matrix')
ax.set_ylabel('Actual')
ax.set_xlabel('Predicted')
fig.tight_layout()
path2 = os.path.join(STATIC_DIR, 'confusion_matrix.png')
fig.savefig(path2)
plt.close(fig)
print("Confusion matrix saved:", os.path.exists(path2))

# Plot 3 - Feature Importance
rf = RandomForestClassifier(random_state=42)
rf.fit(X_train, y_train)
importance = pd.Series(rf.feature_importances_, index=X.columns)
fig, ax = plt.subplots(figsize=(8, 6))
importance.sort_values().plot(kind='barh', color='steelblue', ax=ax)
ax.set_title('Feature Importance')
fig.tight_layout()
path3 = os.path.join(STATIC_DIR, 'feature_importance.png')
fig.savefig(path3)
plt.close(fig)
print("Feature importance saved:", os.path.exists(path3))

# Save model
model_path = os.path.join(BASE_DIR, 'model.pkl')
with open(model_path, 'wb') as f:
    pickle.dump(model, f)
print("Model saved:", os.path.exists(model_path))