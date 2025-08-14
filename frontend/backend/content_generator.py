import re
from collections import Counter

# A simple list of English stop words for the PoC
STOP_WORDS = set([
    "a", "an", "the", "in", "on", "at", "for", "to", "of", "and", "or", "is", "are",
    "was", "were", "it", "you", "i", "we", "they", "he", "she", "that", "this",
    "with", "as", "by", "from", "but", "not", "be", "have", "has", "had", "do",
    "does", "did", "will", "can", "could", "would", "should", "what", "when",
    "where", "who", "whom", "why", "how", "its", "your", "my", "our", "their"
])

def generate_vocabulary(text, num_words=10):
    """
    Generates a list of vocabulary words from the given text.
    """
    # Remove punctuation and convert to lowercase
    words = re.findall(r'\b\w+\b', text.lower())

    # Filter out stop words and short words
    filtered_words = [word for word in words if word not in STOP_WORDS and len(word) > 3]

    # Get the most common words
    word_counts = Counter(filtered_words)
    vocabulary = [word for word, count in word_counts.most_common(num_words)]

    return vocabulary

def generate_questions(text, num_questions=10):
    """
    Generates yes/no and agree/disagree questions from the given text.
    """
    # Split text into sentences. A simple split by '.' will do for a PoC.
    sentences = [s.strip() for s in text.split('.') if s.strip() and len(s.split()) > 4] # Only use sentences with more than 4 words

    # For the PoC, we will use sentences as agree/disagree statements.
    agree_disagree_statements = sentences[:num_questions]

    # And for yes/no questions, we can create some simple ones based on the vocabulary.
    vocabulary = generate_vocabulary(text, num_words=num_questions)
    yes_no_questions = [f"Is the word '{word}' relevant to the topic of this text?" for word in vocabulary]

    return {
        "round_one": yes_no_questions,
        "round_two": agree_disagree_statements
    }
