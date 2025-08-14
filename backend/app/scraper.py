import requests
from bs4 import BeautifulSoup

def get_daily_holiday():
    """
    Scrapes the National Today website to get the main holiday of the day.
    """
    try:
        main_url = "https://nationaltoday.com/"
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'}

        main_response = requests.get(main_url, headers=headers)
        main_response.raise_for_status()
        main_soup = BeautifulSoup(main_response.content, 'html.parser')

        holiday_link_element = main_soup.select_one('.holiday-card-v3 a.title')
        if not holiday_link_element:
            raise Exception("Could not find the main holiday link on the page.")

        holiday_url = holiday_link_element['href']
        holiday_name = holiday_link_element.text.strip()

        holiday_response = requests.get(holiday_url, headers=headers)
        holiday_response.raise_for_status()
        holiday_soup = BeautifulSoup(holiday_response.content, 'html.parser')

        article_body = holiday_soup.find('div', class_='single-holiday-content')
        if not article_body:
            raise Exception("Could not find the article content on the holiday page.")

        paragraphs = article_body.find_all('p')
        article_text = "\n".join([p.get_text() for p in paragraphs])

        return holiday_name, holiday_url, article_text

    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL: {e}")
        return None, None, None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None, None, None

if __name__ == '__main__':
    name, url, text = get_daily_holiday()
    if name and url and text:
        print(f"Holiday: {name}")
        print(f"URL: {url}")
        print("\n--- Article Text ---")
        print(text[:500] + "...")
    else:
        print("Failed to retrieve the holiday.")
