import re

def generate_content(article_text):
    """
    Generates vocabulary and questions based on the article text.
    This is a simplified implementation for the PoC.
    """
    # Vocabulary: Find 10 unique, longer words
    words = re.findall(r'\b[a-zA-Z]{6,}\b', article_text.lower())
    unique_words = sorted(list(set(words)))
    vocabulary = unique_words[:10]

    # Sentences for questions
    sentences = [s.strip() for s in article_text.split('.') if len(s.strip()) > 20]

    # Yes/No Questions
    round_one = []
    question_starters_yes_no = ["Is it true that ", "Does the article mention that ", "Was it stated that "]
    for i, sentence in enumerate(sentences[:10]):
        if len(round_one) >= 10:
            break
        question = f"{question_starters_yes_no[i % len(question_starters_yes_no)]}{sentence.lower()}?"
        round_one.append(question)

    # Agree/Disagree Statements
    round_two = []
    statement_starters = ["One could argue that ", "It is interesting that ", "A key takeaway is that "]
    for i, sentence in enumerate(sentences[10:20]):
        if len(round_two) >= 10:
            break
        statement = f"{statement_starters[i % len(statement_starters)]}{sentence}."
        round_two.append(statement)

    while len(vocabulary) < 10:
        vocabulary.append("holiday")
    while len(round_one) < 10:
        round_one.append("Is this holiday celebrated worldwide?")
    while len(round_two) < 10:
        round_two.append("This holiday is the most important of the year.")

    return {
        "vocabulary": vocabulary,
        "round_one": round_one,
        "round_two": round_two
    }
