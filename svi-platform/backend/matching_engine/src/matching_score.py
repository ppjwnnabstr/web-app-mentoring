def normalize(text):
    return str(text).strip().lower()


def calculate_matching_score(mentor, mentee):
    mentor_exp = [
        normalize(mentor["exp_1st"]),
        normalize(mentor["exp_2nd"]),
        normalize(mentor["exp_3rd"]),
    ]

    mentor_strength = [
        normalize(mentor["Strength_1st"]),
        normalize(mentor["Strength_2nd"]),
        normalize(mentor["Strength_3rd"]),
    ]

    focus1_match = int(
        normalize(mentee["interest_1st"]) in mentor_exp
    )

    goal1_match = int(
        normalize(mentee["goal_1st"]) in mentor_strength
    )

    focus2_match = int(
        normalize(mentee["interest_2nd"]) in mentor_exp
    )

    goal2_match = int(
        normalize(mentee["goal_2nd"]) in mentor_strength
    )

    focus3_match = int(
        normalize(mentee["interest_3rd"]) in mentor_exp
    )

    goal3_match = int(
        normalize(mentee["goal_3rd"]) in mentor_strength
    )

    weights = [30.555, 30.555, 13.89, 13.89, 5.555, 5.555]

    matches = [
        focus1_match,
        goal1_match,
        focus2_match,
        goal2_match,
        focus3_match,
        goal3_match,
    ]

    score = sum(
        match * weight
        for match, weight in zip(matches, weights)
    )

    return {
        "focus1_match": focus1_match,
        "goal1_match": goal1_match,
        "focus2_match": focus2_match,
        "goal2_match": goal2_match,
        "focus3_match": focus3_match,
        "goal3_match": goal3_match,
        "score": score,
    }
