# main.py

from text_classification import train_classifier, classify_text, analyze_results

if __name__ == "__main__":
    classifier = train_classifier()
    result = classify_text("Texto para classificar", classifier)
    print(f"Classificação: {result}")
    accuracy = analyze_results()
    print(f"Acurácia: {accuracy}")
