import sys
import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors

# Load dataset and skip malformed rows
try:
    df = pd.read_csv("books.csv", on_bad_lines='skip')
except Exception as e:
    print(json.dumps([]))
    sys.exit()

# Fill missing values
df['title'] = df['title'].fillna('')
df['authors'] = df['authors'].fillna('')

# Get query from command-line
if len(sys.argv) < 2:
    print(json.dumps([]))
    sys.exit()

query_title = sys.argv[1]

# Combine title + authors for better similarity
df['title_author'] = df['title'] + " " + df['authors']

# TF-IDF vectorization
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['title_author'].astype(str))

# Fit KNN model
knn = NearestNeighbors(n_neighbors=6, metric='cosine')
knn.fit(tfidf_matrix)

# Transform the query into TF-IDF
query_vec = tfidf.transform([query_title])

# Find nearest neighbors
distances, neighbors = knn.kneighbors(query_vec, n_neighbors=6)

# Get recommended titles
recommended_indices = neighbors[0]  # first row
recommendations = df['title'].iloc[recommended_indices].tolist()

# Remove the exact match of the query if present
unique_recommendations = [b for b in recommendations if b.lower() != query_title.lower()]

# Remove duplicates while preserving order
seen = set()
final_recommendations = []
for book in unique_recommendations:
    if book not in seen:
        final_recommendations.append(book)
        seen.add(book)

# Sort by ratings_count (highest first)
final_recommendations.sort(key=lambda x: df.loc[df['title'] == x, 'ratings_count'].values[0], reverse=True)

# Output JSON
print(json.dumps(final_recommendations))
