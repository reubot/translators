{
	"translatorID": "7fc76bfc-3a1a-47e7-93cc-4deed69bee5f",
	"label": "NewsBank",
	"creator": "Reuben Peterkin",
	"target": "https?://infoweb.newsbank.com/apps/news/",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2021-08-06 07:05:28"
}

function detectWeb(doc, url) {
	if (getRISText(doc)) return "newspaperArticle";
	if (url.includes("results")) return "multiple";
	//	Zotero.debug(url.indexOf("results"));
	return false;
}

function getSearchResults(doc) {
	var items = {}, found = false;
	var rows = doc.getElementById('search-hits-gnus-search-hits-pane');
	if (!rows) return false;
	rows = rows.getElementsByTagName('article');
	//	Zotero.debug(rows);

	for (var i = 0; i < rows.length; i++) {
		//		var count = rows[i].getElementsByClassName('count')[0];
		//		if (!count) count = "";
		//		else count = count.textContent.replace(/^\s*(\d+)[\s\S]*/, '$1') + '. ';

		//		var title = doc.querySelector('.search-hits__hit__title');
		var title = rows[i].getElementsByClassName('search-hits__hit__title')[0];
		var hdl = rows[i].getElementsByTagName('a')[0];
		var prefix = hdl.getElementsByClassName('element-invisible')[0];
		if (!hdl) continue;

		found = true;

		items[hdl.href] = ZU.trimInternal(title.textContent.replace(prefix.textContent, ''));
	}

	return found ? items : false;
}

function getRISText(doc) {
	return ZU.xpathText(doc, '//textarea[@id="nbplatform-easybib-export-records"]');
}

function getItem(doc) {
	//	ZU.doGet(getRISLink(doc), function(text) {
	var text = getRISText(doc);
	//	Z.debug(text);
	var trans = Zotero.loadTranslator('import');
	// RIS
	trans.setTranslator('32d59d2d-b65a-4da4-b0a3-bdd3cfb979e7');
	trans.setString(text);
	trans.setHandler('itemDone', function (obj, item) {
		item.url = ZU.xpathText(doc, '//div[@class="actions-bar__urltext"]');
		//		Z.debug
		//		console.log(ZU.xpath(doc,'//script[contains(.,"nbcore_pdf"))]'));
		var jsontext = (ZU.xpathText(doc, '//script[contains(.,"nbcore_pdf")]'));
		jsontext = jsontext.replace("<!--//--><![CDATA[//><!--", "");
		jsontext = jsontext.replace("jQuery.extend(Drupal.settings,", "");
		jsontext = jsontext.replace(new RegExp('\\);$', 'm'), "");
		jsontext = jsontext.replace("//--><!]]>", " ");
		//		Z.debug(jsontext);
		var pdfJSON = JSON.parse(jsontext);
		//		Z.debug(pdfJSON);
		var notebody = pdfJSON.nbcore_pdf['nbcore-pdf-ascii-bar'].template_params.body;
		item.notes.push({ note: ZU.trim(notebody) });
		//		item.attachments.push()
		item.complete();
	});
	trans.translate();
}

function doWeb(doc, url) {
	if (detectWeb(doc, url) == "multiple") {
		var items = getSearchResults(doc);
		//	Zotero.debug(items);

		Zotero.selectItems(items, function (items) {
			if (!items) return true;
			var ids = [];

			for (var i in items) {
				ids.push(i);
			}
			Zotero.debug(ids);
			ZU.processDocuments(ids, getItem);
			return false;
		});
	}
	else {
		getItem(doc);
	}
}

// Test cast modified from "The Times and Sunday Times.js"
/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "https://infoweb.newsbank.com/apps/news/openurl?ctx_ver=z39.88-2004&rft_id=info%3Asid/infoweb.newsbank.com&svc_dat=AWNB&req_dat=3AD092142963457FA426C327101D0723&rft_val_format=info%3Aofi/fmt%3Akev%3Amtx%3Actx&rft_dat=document_id%3Anews%252F16579C8CD2790100",
		"items": [
			{
				"itemType": "newspaperArticle",
				"title": "Rare animals among body count at Scottish zoos",
				"creators": [
					{
						"firstName": "Mark",
						"lastName": "Macaskill",
						"creatorType": "author"
					}
				],
				"date": "July 2, 2017",
				"pages": "3",
				"libraryCatalog": "NewsBank",
				"archive": "Access World News",
				"publicationTitle": "Sunday Times, The (London, England)",
				"url": "https://infoweb.newsbank.com/apps/news/openurl?ctx_ver=z39.88-2004&rft_id=info%3Asid/infoweb.newsbank.com&svc_dat=AWNB&req_dat=3AD092142963457FA426C327101D0723&rft_val_format=info%3Aofi/fmt%3Akev%3Amtx%3Actx&rft_dat=document_id%3Anews%252F16579C8CD2790100",
				"attachments": [],
				"tags": [],
				"notes": [
					{
						"note": "<p>SQN: 127147919</p>"
					},
					{
						"note": "More than 900 creatures in the care of the Royal Zoological Society of Scotland (RZSS) died in captivity last year, including several hundred rare snails bred for conservation.<br/>\n         <br/>Figures released by the charity, which runs the 82-acre Edinburgh Zoo and a wildlife park in the Scottish Highlands, show that about 25 animals were put down on health grounds.<br/>\n         <br/>\nDozens more perished within weeks of birth, among them several animals designated as under threat by the International Union for Conservation of Nature and Natural Resources Red List.<br/>\n         <br/>\nThey included a female socorro dove, which is extinct in the wild; four cottontop tamarins and three visayan warty pigs (both critically endangered species); a barbary macaque and two painted hunting dogs (both endangered species); and a crowned lemur, which is categorised as vulnerable.<br/>\n         <br/>\nAccording to the RZSS, a total of 856 animals aged 30 days and more died in 2016. A further 71 failed to survive beyond 30 days of birth. In 2015, about 700 animals died.<br/>\n         <br/>\nThe partula snail, an endangered gastropod which originates on the steep volcanic forested islands of French Polynesia, accounted for the bulk of casualties. The RZSS is part of an international conservation effort to protect the snail and reintroduced more than 600 to Tahiti last year amid fanfare. A less wellknown fact is that a further 749 died in captivity.<br/>\n         <br/>\nRZSS officials pointed out that it cares for more than 8,000 creatures and insisted that the \"vast majority\" of animals died from natural causes . However, Elisa Allen, director of the UK charity, People for the Ethical Treatment of Animals, said captive animals often died far short of their natural life expectancy.<br/>\n         <br/>\n\"Even the best zoos can never meet all the unique environmental, nutritional, and social needs of the various species they imprison. The obscene amount of money zoos spend on buying, breeding, and housing exotic animals could benefit so many more animals in the wild and go a long way towards addressing the root causes of animal extinction and endangerment: habitat destruction and poaching. Anyone who cares about helping animals should donate to programmes that protect them in their natural habitats and shun these glorified animal prisons.\"<br/>\n         <br/>\nLast year's casualties included Edinburgh Zoo's first forest reindeer calf, which was euthanised following \"mobility problems brought on by a spinal infection ... an extensive programme of treatment failed to improve his situation\", said officials.<br/>\n         <br/>\nThree-year-old Yooranah, the first koala ever to be born in the UK, died at Edinburgh Zoo last June after a \"prolonged period of illness\".<br/>\n         <br/>\nThe plight of partula snails has inspired a huge conservation effort after the tiny gastropod, which is so small it can fit on the edge of a 50p piece, became fodder for the non-native rosy wolf snail, which was introduced to French Polynesia in the 1970s. The partula, which grows to about an inch long, is said to live for up to 10 years and was documented by Captain Cook during his travels in 1769.<br/>\n         <br/>\nThe snails have provided valuable insights into the mechanisms of evolution since different species have developed shell colouring suited to the environments they inhabit.<br/>\n         <br/>\nThe RZSS, which has been involved in the conservation of partula snails since 1984, did not provide full details of how or why so many snails died last year but indicated that many had reached the end of their life span.<br/>\n         <br/>\n\"It is difficult to establish exact life expectancies, and different subspecies tend to live for very different periods of time. The best estimates we have in captivity is about three to four years for the species we hold,\" said a spokesman.<br/>\n         <br/>\nZoo officials added that partula snail mortality is at its highest when young - the snails are thin shelled and delicate and more sensitive to minor changes in their environment. \"The team at RZSS Edinburgh Zoo have been hugely successful in breeding and reintroducing this critically endangered species in the wild,\" added the spokesman."
					}

				],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/
