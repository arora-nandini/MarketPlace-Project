from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def calculate_similarity(files):
    filenames = list(files.keys())
    embeddings = model.encode(list(files.values()))

    comparisons = []
    total_sim = 0
    count = 0

    for i in range(len(filenames)):
        for j in range(i + 1, len(filenames)):
            sim = cosine_similarity(embeddings[i], embeddings[j])
            percent = round(sim * 100, 2)

            comparisons.append({
                "file1": filenames[i],
                "file2": filenames[j],
                "similarity": percent
            })

            total_sim += percent
            count += 1

    overall = round(total_sim / count, 2) if count > 0 else 0
    return overall, comparisons
