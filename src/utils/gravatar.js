import fetchJsonp from "fetch-jsonp";

export async function fetchGrAvatarData(hash) {
    let gravatar = false;
    try {
        let content = await fetchJsonp("https://gravatar.com/" + hash + ".json");
        let parsed_content = await content.json();
        gravatar = parsed_content.entry[0];
        if (gravatar.ims) {
            gravatar.ims.forEach((element) => {
                if (element.type == "skype") gravatar.skype = element.value;
            });
        }
    } catch (error) {
        console.log(error);
    }
    return gravatar;
}