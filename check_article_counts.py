#!/usr/bin/env python3
"""
Script to check article distribution for control group recommendations.
Analyzes whether we have sufficient articles within Overton windows
for different user stance positions (especially neutral users).
"""

import csv
from collections import defaultdict

def calculate_perspective_score(stance, strength):
    """
    Calculate perspective score from article stance and strength.
    Returns score in range [-1, 1].
    """
    if not stance or strength is None:
        return 0
    
    # Normalize strength to 0-1 range (1-10 scale)
    strength = int(strength)
    normalized_strength = max(0, min(1, strength / 10))
    
    # Normalize stance
    stance_lower = stance.lower().strip().replace('–', '-')
    
    # Positive stances (get positive scores)
    positive_stances = [
        'pro-choice', 'pro gun control', 'pro-gun control',
        'pro assisted death', 'pro-assisted death', 'pro nuclear power',
        'pro regulation', 'pro armament', 'high concern'
    ]
    
    # Negative stances (get negative scores)
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

def analyze_article_distribution(csv_file):
    """
    Analyze article distribution by:
    1. Topic and perspective score position (0-100 scale)
    2. Check coverage within typical Overton windows
    """
    # Store articles with their calculated perspective scores
    articles_by_topic = defaultdict(list)
    
    # Read the CSV file
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=';')
        
        for row in reader:
            try:
                topic = row['topic'].strip()
                stance = row['stance'].strip()
                strength = row['strength'].strip()
                
                # Calculate perspective score
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

def get_base_window_size(topic):
    """Get base Overton window size for a topic (in [-1, 1] scale)."""
    base_windows = {
        'abortion': 0.6,              # Narrow - highly polarized (±0.3)
        'gun control': 0.6,           # Narrow - polarized
        'assisted death': 0.8,        # Wider - less polarized (±0.4)
        'nuclear power': 0.7,         # Moderate (±0.35)
        'social media regulation': 0.7,  # Moderate
        'military armament': 0.6,     # Narrow - polarized
        'climate action': 0.7,        # Moderate
    }
    return base_windows.get(topic, 0.6)

def check_overton_window_coverage(articles_by_topic):
    """
    Check if we have enough articles within typical Overton windows
    for different user stance positions.
    """
    # Test user positions (on 0-100 scale)
    # 0 = strongly anti, 50 = neutral, 100 = strongly pro
    test_positions = {
        'strongly_anti': 10,    # Very anti stance users
        'moderately_anti': 30,  # Moderately anti
        'neutral': 50,          # Neutral users (CRITICAL!)
        'moderately_pro': 70,   # Moderately pro
        'strongly_pro': 90,     # Very pro stance users
    }
    
    problems = []
    
    for topic, articles in sorted(articles_by_topic.items()):
        # Get base window size for this topic (in [-1, 1] scale)
        window_size_neg1_to_1 = get_base_window_size(topic)
        
        # Convert to 0-100 scale (multiply by 50)
        window_half_size = (window_size_neg1_to_1 / 2) * 50
        
        print(f"\n{'='*80}")
        print(f"Topic: {topic}")
        print(f"Base window size: ±{window_half_size:.1f} on 0-100 scale")
        print(f"Total articles: {len(articles)}")
        print('='*80)
        
        # Check each test position
        for position_name, user_position in test_positions.items():
            window_min = max(0, user_position - window_half_size)
            window_max = min(100, user_position + window_half_size)
            
            # Count articles within window
            articles_in_window = [
                a for a in articles 
                if window_min <= a['perspective_0_100'] <= window_max
            ]
            
            count = len(articles_in_window)
            status = "✓" if count >= 5 else "⚠️ "
            
            print(f"{status} {position_name:20} (pos {user_position:3.0f}): "
                  f"window [{window_min:5.1f}, {window_max:5.1f}] -> {count:2} articles")
            
            if count < 5:
                problems.append({
                    'topic': topic,
                    'position_name': position_name,
                    'user_position': user_position,
                    'window_min': window_min,
                    'window_max': window_max,
                    'count': count,
                    'articles': articles_in_window
                })
                
                # Show which articles ARE in the window
                if count > 0:
                    print(f"     Articles found:")
                    for a in articles_in_window:
                        print(f"       - {a['stance']:30} strength={a['strength']} "
                              f"(score: {a['perspective_0_100']:.1f})")
    
    return problems

def print_summary(problems):
    """Print summary of problems found."""
    print("\n" + "="*80)
    print(f"SUMMARY: Found {len(problems)} problematic combinations")
    print("="*80)
    
    if problems:
        print("\nThe following user positions have fewer than 5 articles in their Overton window:\n")
        for p in problems:
            print(f"⚠️  {p['topic']:25} | {p['position_name']:20} | "
                  f"window [{p['window_min']:5.1f}, {p['window_max']:5.1f}] | "
                  f"Count: {p['count']}")
    else:
        print("\n✅ All user positions have at least 5 articles in their Overton windows!")
    
    print()

def print_perspective_score_distribution(articles_by_topic):
    """Print the distribution of perspective scores to help visualize coverage."""
    print("\n" + "="*80)
    print("PERSPECTIVE SCORE DISTRIBUTION (0-100 scale)")
    print("="*80)
    
    for topic, articles in sorted(articles_by_topic.items()):
        print(f"\n📊 {topic}:")
        
        # Create bins for 0-100 scale
        bins = list(range(0, 101, 10))
        bin_counts = defaultdict(int)
        
        for article in articles:
            score = article['perspective_0_100']
            # Find which bin this falls into
            bin_idx = min(int(score // 10) * 10, 90)  # Cap at 90 for last bin
            bin_counts[bin_idx] += 1
        
        # Print bar chart
        for bin_start in bins[:-1]:  # Exclude the 100 endpoint
            bin_end = bin_start + 10
            count = bin_counts[bin_start]
            bar = '█' * count
            print(f"  [{bin_start:3}-{bin_end:3}): {count:2} {bar}")

if __name__ == "__main__":
    csv_file = '/home/matejas/TWON/RecommenderSystems/articles.csv'
    
    print("Analyzing article distribution for control group recommendations...")
    print("="*80)
    
    # Analyze articles and calculate perspective scores
    articles_by_topic = analyze_article_distribution(csv_file)
    
    # Check Overton window coverage
    problems = check_overton_window_coverage(articles_by_topic)
    
    # Print summary
    print_summary(problems)
    
    # Print distribution visualization
    print_perspective_score_distribution(articles_by_topic)
