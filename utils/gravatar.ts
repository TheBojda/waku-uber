import fetchJsonp from "fetch-jsonp";

export async function fetchGrAvatarData(hash: string): Promise<any> {
    let gravatar: any = false;
    try {
        const content = await fetchJsonp("https://gravatar.com/" + hash + ".json");
        const parsed_content = await content.json();
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