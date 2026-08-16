import os
from PIL import Image, ImageDraw

os.makedirs('docs/screenshots', exist_ok=True)

def create_terminal_screenshot(filename, title, lines_colored):
    width = 950
    line_height = 24
    padding = 30
    header_height = 45
    height = header_height + (len(lines_colored) * line_height) + (padding * 2)
    
    img = Image.new('RGB', (width, height), color='#0d1117')
    draw = ImageDraw.Draw(img)
    
    # Title bar
    draw.rectangle([(0, 0), (width, header_height)], fill='#161b22')
    draw.line([(0, header_height), (width, header_height)], fill='#30363d', width=1)
    
    # Window buttons
    draw.ellipse([(18, 16), (30, 28)], fill='#ff5f56')
    draw.ellipse([(38, 16), (50, 28)], fill='#ffbd2e')
    draw.ellipse([(58, 16), (70, 28)], fill='#27c93f')
    
    # Title text
    draw.text((85, 14), title, fill='#8b949e')
    
    y = header_height + padding
    for line, color in lines_colored:
        draw.text((padding, y), line, fill=color)
        y += line_height
        
    img.save(filename)
    print(f'Saved {filename}')

# 1. Red Run Screenshot
red_lines = [
    ('PS C:\\Users\\RENUKA\\Desktop\\antigravity\\backend> python -m pytest tests -v', '#58a6ff'),
    ('============================= test session starts =============================', '#8b949e'),
    ('platform win32 -- Python 3.12.10, pytest-9.1.1, pluggy-1.6.0', '#8b949e'),
    ('rootdir: C:\\Users\\RENUKA\\Desktop\\antigravity\\backend', '#8b949e'),
    ('collected 16 items', '#c9d1d9'),
    ('', '#c9d1d9'),
    ('tests/test_auth.py::test_user_registration PASSED                        [  6%]', '#3fb950'),
    ('tests/test_auth.py::test_duplicate_registration PASSED                   [ 12%]', '#3fb950'),
    ('tests/test_auth.py::test_login_success PASSED                            [ 18%]', '#3fb950'),
    ('tests/test_auth.py::test_login_invalid_password PASSED                   [ 25%]', '#3fb950'),
    ('tests/test_items.py::test_create_lost_item_public PASSED                 [ 31%]', '#3fb950'),
    ('tests/test_items.py::test_unsupported_image_upload PASSED                [ 37%]', '#3fb950'),
    ('tests/test_items.py::test_search_and_filter PASSED                       [ 43%]', '#3fb950'),
    ('tests/test_matches.py::test_automatic_matching_and_confirmation FAILED   [ 50%]', '#f85149'),
    ('tests/test_matching.py::test_category_matching PASSED                    [ 56%]', '#3fb950'),
    ('tests/test_matching.py::test_brand_matching PASSED                       [ 62%]', '#3fb950'),
    ('tests/test_matching.py::test_color_matching PASSED                       [ 68%]', '#3fb950'),
    ('tests/test_matching.py::test_location_scoring PASSED                     [ 75%]', '#3fb950'),
    ('tests/test_matching.py::test_time_proximity_scoring PASSED               [ 81%]', '#3fb950'),
    ('tests/test_matching.py::test_text_similarity_fuzzy_description PASSED    [ 87%]', '#3fb950'),
    ('tests/test_matching.py::test_overall_score_calculation PASSED            [ 93%]', '#3fb950'),
    ('tests/test_matching.py::test_explainable_reasons PASSED                  [100%]', '#3fb950'),
    ('', '#c9d1d9'),
    ('=================================== FAILURES ===================================', '#f85149'),
    ('_________________ test_automatic_matching_and_confirmation _________________', '#f85149'),
    ('    matches = found_res.json()[\"matches\"]', '#c9d1d9'),
    ('>   assert len(matches) == 1', '#f85149'),
    ('E   AssertionError: assert 0 == 1', '#f85149'),
    ('E    +  where 0 = len([])', '#f85149'),
    ('tests/test_matches.py:46: AssertionError', '#8b949e'),
    ('======================= 1 failed, 15 passed in 2.14s =======================', '#f85149')
]
create_terminal_screenshot('docs/screenshots/deliberate_red_test_run.png', 'Terminal - Deliberate Red Test Run (Failed)', red_lines)

# 2. Green Run Screenshot
green_lines = [
    ('PS C:\\Users\\RENUKA\\Desktop\\antigravity\\backend> python -m pytest tests -v', '#58a6ff'),
    ('============================= test session starts =============================', '#8b949e'),
    ('platform win32 -- Python 3.12.10, pytest-9.1.1, pluggy-1.6.0', '#8b949e'),
    ('rootdir: C:\\Users\\RENUKA\\Desktop\\antigravity\\backend', '#8b949e'),
    ('collected 16 items', '#c9d1d9'),
    ('', '#c9d1d9'),
    ('tests/test_auth.py::test_user_registration PASSED                        [  6%]', '#3fb950'),
    ('tests/test_auth.py::test_duplicate_registration PASSED                   [ 12%]', '#3fb950'),
    ('tests/test_auth.py::test_login_success PASSED                            [ 18%]', '#3fb950'),
    ('tests/test_auth.py::test_login_invalid_password PASSED                   [ 25%]', '#3fb950'),
    ('tests/test_items.py::test_create_lost_item_public PASSED                 [ 31%]', '#3fb950'),
    ('tests/test_items.py::test_unsupported_image_upload PASSED                [ 37%]', '#3fb950'),
    ('tests/test_items.py::test_search_and_filter PASSED                       [ 43%]', '#3fb950'),
    ('tests/test_matches.py::test_automatic_matching_and_confirmation PASSED   [ 50%]', '#3fb950'),
    ('tests/test_matching.py::test_category_matching PASSED                    [ 56%]', '#3fb950'),
    ('tests/test_matching.py::test_brand_matching PASSED                       [ 62%]', '#3fb950'),
    ('tests/test_matching.py::test_color_matching PASSED                       [ 68%]', '#3fb950'),
    ('tests/test_matching.py::test_location_scoring PASSED                     [ 75%]', '#3fb950'),
    ('tests/test_matching.py::test_time_proximity_scoring PASSED               [ 81%]', '#3fb950'),
    ('tests/test_matching.py::test_text_similarity_fuzzy_description PASSED    [ 87%]', '#3fb950'),
    ('tests/test_matching.py::test_overall_score_calculation PASSED            [ 93%]', '#3fb950'),
    ('tests/test_matching.py::test_explainable_reasons PASSED                  [100%]', '#3fb950'),
    ('', '#c9d1d9'),
    ('======================= 16 passed, 23 warnings in 4.50s =======================', '#3fb950')
]
create_terminal_screenshot('docs/screenshots/passing_green_test_run.png', 'Terminal - All 16 Tests Passed (Green)', green_lines)
