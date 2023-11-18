import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
import string
from joblib import dump

# Importando os dados de treinamento do arquivo data.py
from data import training_data

# Função para pré-processar o texto
def preprocess_text(text):
    text = text.lower()
    text = ''.join([char for char in text if char not in string.punctuation])
    return text

# Convertendo os dados para um DataFrame
df = pd.DataFrame(training_data, columns=['text', 'emotion'])

# Pré-processando os textos
df['text'] = df['text'].apply(preprocess_text)

# Dividindo os dados em treino e teste
X_train, X_test, y_train, y_test = train_test_split(df['text'], df['emotion'], test_size=0.2, random_state=42)

# Criando e treinando o pipeline do modelo
pipeline = make_pipeline(TfidfVectorizer(), MultinomialNB())
pipeline.fit(X_train, y_train)

# Salvando o modelo
dump(pipeline, 'sentiment_model.joblib')
