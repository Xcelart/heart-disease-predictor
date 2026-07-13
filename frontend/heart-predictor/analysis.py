import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score,classification_report, confusion_matrix
from sklearn.tree import  DecisionTreeClassifier 
from sklearn.ensemble import RandomForestClassifier


df= pd.read_csv(r"C:\Users\aryan\Downloads\heart.csv")
print(df.shape)
print(df.head())
print(df.info())
print("---")
print(df.isnull().sum())
print("---")
print(df.describe())
print("---")
print(df['target'].value_counts())

sns.countplot(x='target', data=df)
plt.title('heart disease distribution')
plt.xlabel('0=no heart disease, 1=heart disease')
plt.ylabel('count')
plt.show()

plt.figure(figsize=(12,8))
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
plt.title ('Correlation Heatmap')
plt.show()



x= df.drop('target',axis=1)
y= df['target']
x_train, x_test, y_train, y_test= train_test_split(x,y, test_size=0.2, random_state=42)
print(x_train.shape)
print(x_test.shape)


model= LogisticRegression(max_iter =1000)
model.fit(x_train,y_train)

y_pred=model.predict(x_test)
accuracy= accuracy_score(y_test,y_pred)
print(f"Accuracy: {accuracy:.5f}")
  

dt=DecisionTreeClassifier(random_state=42)
dt.fit(x_train,y_train)
dt_pred= dt.predict(x_test)
print(f"Decision Tree Accuracy: {accuracy_score(y_test, dt_pred):.5f}")

rf=RandomForestClassifier(random_state=42)
rf.fit(x_train,y_train)
rf_pred= rf.predict(x_test)
print(f"Random Forest Accuracy: {accuracy_score(y_test, rf_pred):.5f}")


print("Logistic Regression Report:")
print(classification_report(y_test, y_pred))

plt.figure(figsize=(6,4))
sns.heatmap(confusion_matrix(y_test, y_pred), 
            annot=True, fmt='d', cmap='Blues')
plt.title('Confusion Matrix - Logistic Regression')
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.show()
