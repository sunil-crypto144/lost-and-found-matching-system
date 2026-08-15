import re
import math
from collections import Counter

def normalize_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    return ' '.join(text.split())

def levenshtein_distance(s1: str, s2: str) -> int:
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

def fuzzy_ratio(s1: str, s2: str) -> float:
    str1 = normalize_text(s1)
    str2 = normalize_text(s2)
    if not str1 or not str2:
        return 0.0
    if str1 == str2:
        return 100.0

    dist = levenshtein_distance(str1, str2)
    max_len = max(len(str1), len(str2))
    if max_len == 0:
        return 100.0
    similarity = (1.0 - (dist / max_len)) * 100.0
    return max(0.0, min(100.0, similarity))

def token_cosine_similarity(s1: str, s2: str) -> float:
    t1 = normalize_text(s1).split()
    t2 = normalize_text(s2).split()
    if not t1 or not t2:
        return 0.0

    vec1 = Counter(t1)
    vec2 = Counter(t2)

    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum([vec1[x] * vec2[x] for x in intersection])

    sum1 = sum([vec1[x] ** 2 for x in vec1.keys()])
    sum2 = sum([vec2[x] ** 2 for x in vec2.keys()])
    denominator = math.sqrt(sum1) * math.sqrt(sum2)

    if not denominator:
        return 0.0

    return (numerator / denominator) * 100.0

def calculate_text_similarity(s1: str, s2: str) -> float:
    if not s1 or not s2:
        return 0.0
    
    str1 = normalize_text(s1)
    str2 = normalize_text(s2)
    if str1 == str2:
        return 100.0
        
    cosine_score = token_cosine_similarity(s1, s2)
    lev_score = fuzzy_ratio(s1, s2)
    
    # Combined score emphasizing token overlap with fuzzy fallback
    final_score = (cosine_score * 0.6) + (lev_score * 0.4)
    return round(max(0.0, min(100.0, final_score)), 2)
