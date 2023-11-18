# sentimentos.py
import sys
import json
from datetime import datetime
from joblib import load
import string

# Função para pré-processamento do texto
def preprocess_text(text):
    text = text.lower()
    text = ''.join([char for char in text if char not in string.punctuation])
    return text

def analyze_sentiment(text):
    # Carregar o modelo treinado
    model = load('src/common/ia/sentiment_model.joblib')
    processed_text = preprocess_text(text)

    # Usando predict_proba para obter probabilidades
    probabilities = model.predict_proba([processed_text])[0]

    # Obtendo as classes (emoções) do modelo
    classes = model.classes_

    # Criando um dicionário de emoções e suas probabilidades com dois dígitos decimais
    sentiment_probabilities = {emotion: round(prob * 100, 2) for emotion, prob in zip(classes, probabilities)}
    return sentiment_probabilities



def main():
    if len(sys.argv) > 1:
        text = sys.argv[1]
    else:
        print("Por favor, forneça um texto para análise.")
        sys.exit(1)

    sentiment_result = analyze_sentiment(text)

    output = {
        "status": "success",
        "data": {
            "text": text,
            "emotion": sentiment_result,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    }

    print(json.dumps(output, indent=4))

if __name__ == "__main__":
    main()
