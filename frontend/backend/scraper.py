import requests
from bs4 import BeautifulSoup
import datetime

def scrape_national_today():
    try:
        url = "https://nationaltoday.com/"
        response = requests.get(url)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        today = datetime.date.today()
        # Format date as "Mon Day", e.g., "Aug 14"
        date_str = today.strftime("%b %d").replace(" 0", " ")


        holidays = soup.find_all('div', class_='slider-day-inner')
        for holiday in holidays:
            date_element = holiday.find('span', class_='ntdb-holiday-date')
            if date_element and date_str in date_element.text:
                title_element = holiday.find('h2', class_='holiday-title-text')
                link_element = holiday.find('a')

                if title_element and link_element:
                    holiday_name = title_element.text.strip()
                    holiday_url = link_element['href']

                    holiday_page_response = requests.get(holiday_url)
                    holiday_page_response.raise_for_status()
                    holiday_soup = BeautifulSoup(holiday_page_response.text, 'html.parser')

                    content_div = holiday_soup.find('div', class_='entry-content')
                    if content_div:
                        paragraphs = content_div.find_all('p')
                        holiday_content = "\n".join([p.get_text(strip=True) for p in paragraphs])
                    else:
                        holiday_content = "Content not found."

                    return {
                        "name": holiday_name,
                        "url": holiday_url,
                        "content": holiday_content
                    }

        return {"error": f"Could not find a holiday for today's date: {date_str}"}

    except requests.exceptions.RequestException as e:
        return {"error": f"Error fetching URL: {e}"}
    except Exception as e:
        return {"error": f"An error occurred: {e}"}
