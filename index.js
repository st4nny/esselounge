const puppeteer = require('puppeteer');
var player = require('play-sound')(opts = {});

(async () => {
    let username = 'username';
    let password = 'password';

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.esselunga.it/area-utenti/applicationCheck?appName=esselungaEcommerce&daru=https%3A%2F%2Fwww.esselungaacasa.it%3A443%2Fecommerce%2Fnav%2Fauth%2Fsupermercato%2Fhome.html%3F&loginType=light');
    const navigationPromise = page.waitForNavigation();
    await page.type('#gw_username', username);
    await page.type('#gw_password', password);
    await page.click('#rememberme');
    await page.click('button[value="Accedi"]');
    await navigationPromise;
    console.log('New Page URL:', page.url());

        await navigationPromise;
        await page.waitForSelector('.tab-spesa' , {
            timeout: 5000
        });
        let btn_consegna = await page.evaluate(() => {
            let items = document.querySelectorAll('nav.tab-spesa ul li');
            items.forEach((item) => {
                if(item.innerText=='Prenotazione consegna'){
                    item.click();
                } else {
                    console.log('Tab non di interesse');
                }
            });
        })
        await navigationPromise;
        await page.waitFor(3000);
        const datatable = await page.$$eval('table tr td', tds => tds.map((td) => {
            return td.innerHTML;
        }));
        await navigationPromise;
        console.log('Array print:');
        let success = false;
        datatable.slice().reverse().forEach(function(x) {
            if(!x.includes('class="esaurita"') && !x.includes('class="non-attiva"') && !x.includes('class="inibita"')){
                // Trovata disponibilità */
                if(x.includes('<label')) {
                    id_slot = x.substring(11, 37);
                    console.log(id_slot);
                    page.click('#'+id_slot);
                    success = true;
                } else {
                    console.log('FASCIA ORARIA: '+x);
                }
            } else {
                console.log('Slot Esaurito');
            }
        });
        if(success) {
            player.play('./success.mp3', function (err) {
                if (err) throw err;
                console.log("Audio finished");
            });
        } else {
            player.play('./sad.mp3', function (err) {
                if (err) throw err;
                console.log("Audio finished");
            });
        }
        browser.close();
})();