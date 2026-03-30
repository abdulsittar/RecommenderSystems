#!/usr/bin/env python3
"""
Check if recommendation algorithms are getting the correct articles for each control group.

Control Group Logic:
- Shows ONLY articles WITHIN Overton window
- Randomized order

Edge Group Logic:
- Shows ALL articles (no window filtering)
- Ranked by edges (outside window first for centrists, opposite edge for extremists)
- Filters out articles more extreme than user (if user stance > 0.8 or < -0.8)

Center Group Logic:
- Shows ALL articles (no window filtering)
- Ranked from center of window outward
- Filters out articles more extreme than user (if user stance > 0.8 or < -0.8)
"""

import csv
from collections import defaultdict

def calculate_perspective_score(stance, strength):
    """Calculate perspective score from article stance and strength."""
    if not stance or strength is None:
        return 0
    
    strength = int(strength)
    normalized_strength = max(0, min(1, strength / 10))
    stance_lower = stance.lower().strip().replace('–', '-')
    
    positive_stances = [
        'pro-choice', 'pro gun control', 'pro-gun control',
        'pro assisted death', 'pro-assisted death', 'pro nuclear power',
        'pro regulation', 'pro armament', 'high concern'
    ]
    
    negative_stances = [
        'pro-life', 'pro gun freedom', 'pro-gun freedom',
        'anti assisted death', 'anti-assisted death', 'anti nuclear power',
        'anti regulation', 'anti armament', 'low concern'
    ]
    
    for pos_stance in positive_stances:
        if pos_stance in stance_lower:
            return normalized_strength
    
    for neg_stance in negative_stances:
        if neg_stance in stance_lower:
            return -normalized_strength
    
    return 0

def perspective_to_0_100(perspective_score):
    """Convert perspective score from [-1, 1] to [0, 100] scale."""
    return (perspective_score + 1) * 50

def get_base_window(topic):
    """Get base Overton window for a topic (in 0-100 scale)."""
    base_windows = {
        'abortion': {'min': 35.0, 'max': 65.0},              # ±15
        'gun control': {'min': 35.0, 'max': 65.0},           # ±15
        'assisted death': {'min': 30.0, 'max': 70.0},        # ±20
        'nuclear power': {'min': 32.5, 'max': 67.5},         # ±17.5
        'social media regulation': {'min': 32.5, 'max': 67.5},  # ±17.5
        'military armament': {'min': 35.0, 'max': 65.0},     # ±15
        'climate action': {'min': 32.5, 'max': 67.5},        # ±17.5
    }
    return base_windows.get(topic, {'min': 35.0, 'max': 65.0})

def is_centrist(stance_score, threshold=0.2):
    """Check if user is centrist."""
    return abs(stance_score) < threshold

def simulate_control_group(articles, user_position, window):
    """Simulate control group: filter to ONLY within window."""
    filtered = [
        a for a in articles 
        if window['min'] <= a['perspective_0_100'] <= window['max']
    ]
    return filtered

def simulate_edge_group(articles, user_stance, window):
    """Simulate edge group: show all articles (with extreme filtering), ranked by edges."""
    extreme_threshold = 0.8
    
    # Filter out articles more extreme than user if user is extreme
    filtered = articles
    if user_stance >= extreme_threshold:
        filtered = [a for a in articles if a['perspective_score'] <= user_stance]
    elif user_stance <= -extreme_threshold:
        filtered = [a for a in articles if a['perspective_score'] >= user_stance]
    
    return filtered

def simulate_center_group(articles, user_stance, window):
    """Simulate center group: show all articles (with extreme filtering), ranked from center."""
    extreme_threshold = 0.8
    
    # Filter out articles more extreme than user if user is extreme
    filtered = articles
    if user_stance >= extreme_threshold:
        filtered = [a for a in articles if a['perspective_score'] <= user_stance]
    elif user_stance <= -extreme_threshold:
        filtered = [a for a in articles if a['perspective_score'] >= user_stance]
    
    return filtered

def analyze_articles(csv_file):
    """Load and analyze articles."""
    articles_by_topic = defaultdict(list)
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=';')
        
        for row in reader:
            try:
                topic = row['topic'].strip()
                stance = row['stance'].strip()
                strength = row['strength'].strip()
                
                persp_score = calculate_perspective_score(stance, strength)
                persp_0_100 = perspective_to_0_100(persp_score)
                
                articles_by_topic[topic].append({
                    'stance': stance,
                    'strength': strength,
                    'perspective_score': persp_score,
                    'perspective_0_100': persp_0_100
                })
            except Exception as e:
                print(f"Error processing row: {e}")
                continue
    
    return articles_by_topic

def check_algorithms(articles_by_topic):
    """Check all three algorithms for different user positions."""
    
    # Test scenarios
    scenarios = [
        {'name': 'Neutral user', 'stance': 0.0, 'position': 50},
        {'name': 'Slightly pro', 'stance': 0.15, 'position': 57.5},
        {'name': 'Moderate pro', 'stance': 0.4, 'position': 70},
        {'name': 'Strong pro', 'stance': 0.7, 'position': 85},
        {'name': 'Extreme pro (0.85)', 'stance': 0.85, 'position': 92.5},
        {'name': 'Slightly anti', 'stance': -0.15, 'position': 42.5},
        {'name': 'Moderate anti', 'stance': -0.4, 'position': 30},
        {'name': 'Strong anti', 'stance': -0.7, 'position': 15},
        {'name': 'Extreme anti (-0.85)', 'stance': -0.85, 'position': 7.5},
    ]
    
    print("="*80)
    print("ALGORITHM COVERAGE ANALYSIS")
    print("="*80)
    
    for topic, articles in sorted(articles_by_topic.items()):
        print(f"\n{'='*80}")
        print(f"Topic: {topic}")
        print(f"Total articles: {len(articles)}")
        print('='*80)
        
        window = get_base_window(topic)
        
        for scenario in scenarios:
            user_stance = scenario['stance']
            user_position = scenario['position']
            
            # Calculate what each group algorithm would show
            control_articles = simulate_control_group(articles, user_position, window)
            edge_articles = simulate_edge_group(articles, user_stance, window)
            center_articles = simulate_center_group(articles, user_stance, window)
            
            print(f"\n{scenario['name']:25} (stance={user_stance:5.2f}, pos={user_position:5.1f})")
            print(f"  Window: [{window['min']:5.1f}, {window['max']:5.1f}]")
            print(f"  Control group: {len(control_articles):3} articles (ONLY within window)")
            print(f"  Edge group:    {len(edge_articles):3} articles (all, ranked by edges)")
            print(f"  Center group:  {len(center_articles):3} articles (all, ranked from center)")
            
            # Check for issues
            if len(control_articles) < 5:
                print(f"  ⚠️  WARNING: Control group has < 5 articles!")
            
            if len(edge_articles) < len(articles) and abs(user_stance) < 0.8:
                print(f"  ⚠️  WARNING: Edge group should show all {len(articles)} articles for non-extreme user!")
            
            if len(center_articles) < len(articles) and abs(user_stance) < 0.8:
                print(f"  ⚠️  WARNING: Center group should show all {len(articles)} articles for non-extreme user!")
            
            # For extreme users, check if filtering is correct
            if abs(user_stance) >= 0.8:
                expected_count = sum(1 for a in articles 
                    if (user_stance > 0 and a['perspective_score'] <= user_stance) or
                       (user_stance < 0 and a['perspective_score'] >= user_stance))
                
                if len(edge_articles) != expected_count:
                    print(f"  ⚠️  WARNING: Edge group filtering issue! Expected {expected_count}, got {len(edge_articles)}")
                if len(center_articles) != expected_count:
                    print(f"  ⚠️  WARNING: Center group filtering issue! Expected {expected_count}, got {len(center_articles)}")

    print("\n" + "="*80)
    print("KEY POINTS:")
    print("="*80)
    print("✓ Control group: Filters to ONLY articles within Overton window")
    print("✓ Edge group: Shows ALL articles (except if user extreme), ranked by edges")
    print("✓ Center group: Shows ALL articles (except if user extreme), ranked from center")
    print("✓ Extreme users (|stance| >= 0.8): Don't see articles more extreme than themselves")
    print()

if __name__ == "__main__":
    csv_file = '/home/matejas/TWON/RecommenderSystems/articles.csv'
    
    print("Analyzing recommendation algorithms for all control groups...")
    articles_by_topic = analyze_articles(csv_file)
    check_algorithms(articles_by_topic)
