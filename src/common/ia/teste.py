import sys
import nltk
import json
from nltk.classify import NaiveBayesClassifier
from data import training_data  # Certifique-se de que este módulo está acessível

def prepare_data(data):
    try:
        return [({word: True for word in nltk.word_tokenize(sentence)}, label) for sentence, label in data]
    except Exception as e:
        print(f"Erro ao preparar os dados: {e}")
        return []

def train_classifier(prepared_data):
    try:
        return NaiveBayesClassifier.train(prepared_data)
    except Exception as e:
        print(f"Erro ao treinar o classificador: {e}")
        return None


def classify_text(text, classifier):
    try:
        tokenized_text = {word: True for word in nltk.word_tokenize(text)}
        prob_result = classifier.prob_classify(tokenized_text)
        
        # Retornar as probabilidades em um dicionário
        return {label: prob_result.prob(label) for label in prob_result.samples()}
        
    except Exception as e:
        print(f"Erro ao classificar o texto: {e}")
        return None

if __name__ == "__main__":
    user_input = sys.argv[1] if len(sys.argv) > 1 else "No text provided"
    
    prepared_data = prepare_data(training_data)
    
    if not prepared_data:
        print(json.dumps({"error": "Dados de treinamento inválidos."}))
        sys.exit(1)
    
    classifier = train_classifier(prepared_data)
    
    if not classifier:
        print(json.dumps({"error": "Erro ao criar o classificador."}))
        sys.exit(1)
    
    result = classify_text(user_input, classifier)
    
    if result is None:
        print(json.dumps({"error": "Erro ao classificar o texto."}))
        sys.exit(1)
    
    response = {
        "text": user_input,
        "emotion": result
    }
    
    print(json.dumps(response))
