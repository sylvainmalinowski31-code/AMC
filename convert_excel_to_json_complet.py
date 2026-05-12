import pandas as pd
import json
import os

# Chemin vers votre fichier Excel
file_path = "FILMS SERIES 2026.xlsm"
sheet_name = "FILMS"

# Liste des colonnes à extraire (adaptez si nécessaire)
columns_to_extract = [
    "reference", "FILMS", "Année", "Durée", "Box Office", "Genre", "Réalisateur", "Acteur",
    "Note_IMDB", "Ma note", "J'ai", "Disque Dur", "VU Sylvain", "Visionnage",
    "VU Jess", "Go", "Compositeur", "Budget", "Pays", "Sortie ciné fr",
    "Sortie dvd / blu ray / streaming", "N° franchise", "Franchise", "Prod",
    "Genre 2nd", "Style", "Origines", "MOTS CLEFS", "Liens", "Public", "Oscar",
    "Oscar majeur", "Nomination Oscar", "Récompenses", "Icones", "Image",
    "Son", "Ma critique", "Titre original", "IMDB_rang", "Étoile légende"
]

# Charger les données
df = pd.read_excel(file_path, sheet_name=sheet_name, usecols=columns_to_extract, engine='openpyxl')

# Convertir les colonnes de durée en chaînes de caractères
df["Durée"] = df["Durée"].astype(str)

# Formater les dates en JJ/MM/AAAA
date_columns = ["Visionnage", "Sortie ciné fr", "Sortie dvd / blu ray / streaming"]
for col in date_columns:
    df[col] = pd.to_datetime(df[col], dayfirst=True, errors='coerce').dt.strftime('%d/%m/%Y')

# Remplacer les valeurs NaN par None
df = df.where(pd.notnull(df), None)

# Générer le JSON
films_json = df.to_dict(orient="records")

# Sauvegarder le JSON dans src/films_complet.json
output_file = os.path.join("src", "films_complet.json")
os.makedirs("src", exist_ok=True)  # Crée le dossier src s'il n'existe pas
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(films_json, f, ensure_ascii=False, indent=4)

print(f"Le fichier JSON a été généré : {output_file}")