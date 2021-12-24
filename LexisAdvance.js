{
	"translatorID": "498974f8-2c85-4cd1-b58a-e5a21ed0c2ad",
	"label": "LexisAdvance",
	"creator": "Reuben Peterkin",
	"target": "^https?://[^/]*lexis-?nexis\\.com|^https?://[^/]*advance\\.lexis\\.com",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsv",
	"lastUpdated": "2021-12-24 14:00:20"
}

/*
	***** BEGIN LICENSE BLOCK *****

	Copyright © 2021 Reuben Peterkin

	This file is part of Zotero.

	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with Zotero. If not, see <http://www.gnu.org/licenses/>.

	***** END LICENSE BLOCK *****
*/

function detectWeb(doc, url) {
	/* from LexisNexis.js
	//besides deciding whether it is a single item or multiple items
	//it is also important here to select the correct frame! Zotero
	//will only focus on one frame and it is possible to work with that
	//frame further.

	//let's go for the navigation bar (2nd frame from top) to call new urls with hidden variables
	//(this is maybe not the natural choice, but it seems to work)
	*/

	if ((url.indexOf("parent=docview") != -1 && url.indexOf("target=results_listview_resultsNav") != -1 ) || url.indexOf("/document/") != -1) {
		Z.debug(url.indexOf("/document/"));
		return "document";
	}

	if (url.indexOf("search") != -1 || ((url.indexOf("contentRenderer.do?") != -1 || url.indexOf("target=results_ResultsList") != -1) && ZU.xpath(doc, '//tr[./td/input[@name="frm_tagged_documents"]]/td/a').length > 0)) {
		return "multiple";
	}
}

function doWeb(doc, url) {
	var title = doc.getElementById('SS_DocumentTitle');
	var item = new Zotero.Item("document");
 	item.title = title.textContent;
  	item.rights = doc.querySelector('.SS_Copyright').textContent;
	var SS_LeftAlign = doc.querySelectorAll('.SS_LeftAlign > div');
// 	Z.debug(SS_LeftAlign);
	for (let i = 0; i < SS_LeftAlign.length; i++) {
// 	for (var div in SS_LeftAlign){
		var tc = (SS_LeftAlign.item(i).textContent);
		Z.debug(tc);
		if (tc.indexOf("Byline:") != -1)
		{
			tc = tc.replace("Byline:","");
			Z.debug(tc);

			item.creators.push(Zotero.Utilities.cleanAuthor(tc, "author", true));
		}
	}
	var docInfo = doc.querySelectorAll("p.SS_DocumentInfo");
// 	Z.debug(docInfo);
	item.publicationTitle = docInfo.item(0).textContent;
	item.date = docInfo.item(1).textContent;

	var SS_LeftAlign_text = doc.querySelector('.SS_LeftAlign').textContent;
// 	Z.debug(SS_LeftAlign_text);
//  	Z.debug(typeof(SS_LeftAlign_text));
	var re = (/Language:\s(.+)Subject:/);
	var language = re.exec(SS_LeftAlign_text)[1];
 //	var language = SS_LeftAlign_text.match(/Language: (\w+)/g);
 		Z.debug(language);
// 	Z.debug(SS_LeftAlign_text.textContent);
		item.language = language;
// 	Z.debug(decodeURI(url));
// 	Z.debug(url);
	var documentid = doc.documentElement.innerHTML.match(/\"documentid\":"(.+?)\"/);
	Z.debug(documentid[1]);
	var docfullpath = doc.documentElement.innerHTML.match(/\"docfullpath\":"(.+?)\"/);
	Z.debug(docfullpath[1]);
/* 	JSON.parse(doc.documentElement.innerHTML);
	var scripts = doc.querySelectorAll('script');
	for (let i = 0; i < scripts.length; i++) {
		var tc = (scripts.item(i).textContent);
// 		Z.debug(tc);
		if (tc.indexOf('"id":"pagemodel","collections":') != -1)
		{
			tc = tc.match(/(.+)this\.set/);
			Z.debug(tc[1]);
// 			JSON.parse(tc);
		}
	}
*/

	var collection = doc.documentElement.innerHTML.match(/\"activecontenttype\":"(.+?)\"/);
	Z.debug(collection[1]);

	// TODO Add url
	// https://help.lexisnexis.com/Flare/nexisuni/US/en_US/Content/topic/gh_urlapisdr.htm
	item.complete();

}

