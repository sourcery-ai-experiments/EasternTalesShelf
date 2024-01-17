import requests
import json


def get_10_newest_entries(media_type: str):
    """Get the 10 newest anime/manga formatted for prompt
    type: 'ANIME' or 'MANGA'
    discord_username: the hashed username of the user whose list you want to get"""
    
    # First get the AniList username based on the Discord username
    anilist_user_id = "444059"
    if anilist_user_id is None:
        return "You need to set your AniList username first using the `set_anilist_username` command.", None

    episodes_or_chapters = None  # default value if media_type is neither ANIME nor MANGA

    if media_type == 'ANIME':
        episodes_or_chapters = 'episodes'
    elif media_type == 'MANGA':
        episodes_or_chapters = 'chapters'


    variables_in_api = {
        'page' : 1,
        'type' : media_type,
        'episodes_or_chapters' : episodes_or_chapters,
        'userId' : anilist_user_id,
        }

    formatted_10_list = ""

    api_request = '''
        query ($page: Int, $type: MediaType, $userId: Int) {
    Page(page: $page, perPage: 20) {
        pageInfo {
        perPage
        }
        mediaList(userId: $userId, type: $type, sort: UPDATED_TIME_DESC) {
        mediaId
        status
        progress
        updatedAt
        media {
            title {
            romaji
            english
            }
            episodes
            chapters
            coverImage{
              large
            }
        }
        }
    }
    }'''
        
    url = 'https://graphql.anilist.co'

    response = requests.post(url, json={'query': api_request, 'variables': variables_in_api})

    response.raise_for_status()

    parsed_json = json.loads(response.text)
    
    
    newest_10_entries = []

    for media_list in parsed_json["data"]["Page"]["mediaList"]:
        media = media_list["media"]
        title = media["title"]
    

        media_dict = {
            'on_list_status': media_list["status"],
            'mediaId': media_list["mediaId"],
            'progress': media_list["progress"],
            'updatedAt': media_list["updatedAt"],
            'english': (title["english"].replace("'", '"') if title["english"] is not None else "no english title"),
            'romaji': title["romaji"].replace("'", '"'),
            'coverImage': media["coverImage"]["large"],
        }

        if media_type == 'ANIME':
            media_dict['episodes'] = media["episodes"] or 0
            
        elif media_type == 'MANGA':
            media_dict['chapters'] = media["chapters"] or 0
        
        newest_10_entries.append(media_dict)

    return  newest_10_entries

test = get_10_newest_entries('MANGA')
print(test)