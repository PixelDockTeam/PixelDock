import { http } from "@tauri-apps/api";
import { ResponseType } from "@tauri-apps/api/http";
import type { torrentData } from "./types";

export class T1337x {
    private baseUrl = "https://1337x.to";
    private parser = new DOMParser();
    private trustedUploader = ["cs.rin.ru", "0xEMPRESS", "anadius", "DODI", "FitGirl", "johncena141", "JohnCena141", "KaOsKrew", "s7on3r", "TinyRepacks"]
    async search(query: string): Promise<torrentData[]> {
        query = query.replaceAll(' ', '+')
        const searchUrl = `${this.baseUrl}/category-search/${query}/Games/1/`
        let torrentList: torrentData[] = []
        const res = await http.fetch(searchUrl, {
            method: 'GET',
            responseType: ResponseType.Text
        }).then((data) => {
            if (data.status = 200) {
                torrentList = this.handleSearchResponse(data.data as string)
            } else {
                console.log(data.status);
                console.error(data.data);
            }
        });
        console.log(torrentList);

        return torrentList
    }
    async getMagnetLink(pageUrl: string): Promise<string> {
        let magnetUrl = ''
        const res = await http.fetch(pageUrl, {
            method: 'GET',
            responseType: ResponseType.Text
        }).then((data) => {
            magnetUrl = this.handlePageResponse(data.data as string)
            console.log(magnetUrl);

        })
        return magnetUrl;
    }
    private handleSearchResponse(data: string): torrentData[] {
        const torrentsList: torrentData[] = []
        const doc = this.parser.parseFromString(data, 'text/html');
        const tableRows = doc.querySelectorAll('table tr');
        // Loop through the table rows, starting from the second row (index 1)
        for (let i = 1; i < tableRows.length; i++) {
            const uploader = tableRows[i].children[5].textContent ?? ''
            // const row = tableRows[i];
            const row: torrentData = {
                name: tableRows[i].children[0].textContent ?? '',
                seed: tableRows[i].children[1].textContent ?? '',
                size: tableRows[i].children[4].childNodes[0].nodeValue ?? '',
                uploader: uploader,
                trusted: this.trustedUploader.includes(uploader),
                href: `${this.baseUrl}${(tableRows[i].children[0].childNodes[1] as HTMLAnchorElement).pathname}`
            }
            torrentsList.push(row)
        }
        return torrentsList;

    }
    private handlePageResponse(data: string): string {
        let magnetUrl = ''
        const doc = this.parser.parseFromString(data, 'text/html')


        magnetUrl = (doc.querySelectorAll("div.clearfix ul")[0].children[0].children[0] as HTMLAnchorElement).href
        return magnetUrl;
    }
}
