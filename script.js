let publicAPIkey = "646c8abb849ddbb1dec2d3a322897d2d";
let privateAPIKey = ""; // YOUR PRIVATE API KEY FROM THE MARVEL API SITE
let md5Hash = "46231ba26cf89c15cd6a7831ff8cbbef"; //ts+privateKey+publicKey

let alpha = "abcdefghijklmnopqrstuvwxyz";
let letter = "";
let limit = "20"; //max 100
let randomindexarray = [];

let offset = "0";
let total = 0;
let possibleSearchTimes = 0;
let numComics = 0;
let numSeries = 0;
let buttonDeg = 0;
let hero = {};
let comic = {};
let series = {};
let heroID = "";
let comicIDs = [];
let seriesIDs = [];
let palette = [];
let toTrans = true;
let toTransButton = true;


let bodyElement = document.getElementById("bod");
let backElement = document.getElementById("background");
let buttonBackElementOne = document.getElementById("buttonbackone");
let buttonBackElementTwo = document.getElementById("buttonbacktwo");
let imgElement = document.getElementById("charimg");
let aboutElement = document.getElementById("about");
let wikiElement = document.getElementById("wiki");
let moreComicsElement = document.getElementById("moreComics");
let heroNameElement = document.getElementById("heroname");
let comicImgElements = document.querySelectorAll('[comic-img]');
let comicLinkElements = document.querySelectorAll('[comic-link]');
let comicTitleElements = document.querySelectorAll('[comic-title]');
let seriesImgElements = document.querySelectorAll('[series-img]');
let seriesLinkElements = document.querySelectorAll('[series-link]');
let seriesTitleElements = document.querySelectorAll('[series-title]');

console.log(comicImgElements);
console.log(comicLinkElements);
console.log(comicTitleElements);

async function GetChar(){
    console.clear();
    comicImgElements.forEach(function(e){
        e.src = "";
    })

    comicTitleElements.forEach(function(e){
        e.innerText = "";
    })

    seriesImgElements.forEach(function(e){
        e.src = "";
    })

    seriesTitleElements.forEach(function(e){
        e.innerText = "";
    })

    hero = {};
    offset = "0";
    let num =  Math.floor(Math.random() * ((alpha.length - 1) - 0) + 0); //Math.floor(Math.random() * (max - min + 1)) + min
    letter = alpha[num];
    //get all characters that start with random letter then get a specific group of them based off of random offset
    console.log("https://gateway.marvel.com/v1/public/characters?nameStartsWith=" + letter + "&ts=1&apikey=" + publicAPIkey + "&hash=" + md5Hash)
    let data = await fetch("https://gateway.marvel.com/v1/public/characters?nameStartsWith=" + letter + "&limit=" + limit +" &offset="+ offset +"&ts=1&apikey=" + publicAPIkey + "&hash=" + md5Hash)
        .then(response => response.json())
        .catch(e => console.log(e));
    total = data.data.total
    possibleSearchTimes = Math.ceil(total/parseInt(limit));
    
    console.log(possibleSearchTimes);
    let timesToOffset = Math.floor(Math.random() * (possibleSearchTimes - 1 + 1) + 1) - 1;
    
    offset = (parseInt(limit)  * timesToOffset).toString();
    console.log(offset);

    if(offset != 0)
    {
        let data = await fetch("https://gateway.marvel.com/v1/public/characters?nameStartsWith=" + letter + "&limit=" + limit +" &offset="+ offset +"&ts=1&apikey=" + publicAPIkey + "&hash=" + md5Hash)
        .then(response => response.json())
        .catch(e => console.log(e));
    }

    console.log(data);
    while(true)
    {
        //get a random character that fits requirments
        console.log("here getting hero");
        hero = data.data.results[Math.floor(Math.random() * ((data.data.results.length - 1) - 0 + 1)) + 0]
        numComics = 0;
        numSeries = 0;
        numComics = hero.comics.available;
        // console.log(numComics);
        // console.log(numSeries);
        numSeries = hero.series.available;
        if(numComics >= 10 && numSeries >= 15)
        {
            break;
        }
    }

    console.log(hero);
    heroID = (hero.id).toString();

    heroNameElement.innerText = hero.name;
    imgElement.src = hero.thumbnail.path + "." + hero.thumbnail.extension;
    aboutElement.innerText = hero.description;
    // wikiElement.href = hero.urls[1].url;
    // moreComicsElement.href = hero.urls[2].url;
    wikiElement.href = "https://www.marvel.com/";
    moreComicsElement.href = "https://www.marvel.com/";
    for(let link of hero.urls)
    {
        if(link.type == "wiki")
        {
            wikiElement.href = link.url;
        }
        else if(link.type == "comiclink")
        {
            moreComicsElement.href = link.url;
        }
    }

    GetComics();
    GetSeries();
}

async function GetComics(){
    comicIDs = [];
    let comicoffset = 0;
    //Get comics of character then select random comics from random offsets
    let comicData = await fetch("https://gateway.marvel.com:443/v1/public/characters/"+ heroID + "/comics?format=comic&limit=" + limit +" &offset="+ comicoffset +"&ts=1&apikey=" + publicAPIkey + "&hash=" + md5Hash)
        .then(response => response.json())
        .catch(e => console.log(e));
    console.log(comicData);

    let comictotal = comicData.data.total
    let comicpossibleSearchTimes = Math.ceil(comictotal/parseInt(limit));

    let comicgoodoffsets = [];

    for(let i = 0; i < comicpossibleSearchTimes; i++)
    {
        comicgoodoffsets.push(i);
    }

    //keep track of bad sets
    let comicbadset = false;
    for(let i = 0; i < 4; i++)
    {
        while(true)
        {
           
            if(comicgoodoffsets.length == 0)
            {
                alert("ran out of comic off sets");
                exit();
            }

            let comictimesToOffset = comicgoodoffsets[Math.floor(Math.random() * ((comicgoodoffsets.length - 1) - 0 + 1)) + 0];
        
            comicoffset = (parseInt(limit)  * comictimesToOffset).toString();
            comicData = await fetch("https://gateway.marvel.com:443/v1/public/characters/"+ heroID + "/comics?format=comic&limit=" + limit +" &offset="+ comicoffset +"&ts=1&apikey=" + publicAPIkey + "&hash=" + md5Hash)
                .then(response => response.json())
                .catch(e => console.log(e));
            console.log(comicData);


            //if you can't find comic in range get new set
            comicrandomindexarray = [];
            for(let j = 0; j < comicData.data.results.length; j++)
            {
                comicrandomindexarray.push(j)
            }
            while(true)
            {
                console.log("here in comics");
                if(comicrandomindexarray.length == 0)
                {
                    //get new set and store the bad set to not get it again
                    console.log("Bad Comic on " + i);
                    comicbadset = true;
                    break;
                }
                let comicindex = comicrandomindexarray[Math.floor(Math.random() * ((comicrandomindexarray.length - 1) - 0 + 1)) + 0]
                comicrandomindexarray.splice(comicrandomindexarray.indexOf(comicindex),1);
                comic = comicData.data.results[comicindex];
                if(comic.pageCount != 0 && comicIDs.indexOf(comic.id) == -1)
                {
                    comicIDs.push(comic.id);
                    break;
                }
            }

            if(!comicbadset)
            {
                console.log("Good Comic on " + i);
                break;
            }
            else
            {
                //remove bad
                console.log("Remove Bad Off Set at space " + i + "with offset " + comictimesToOffset);
                comicgoodoffsets.splice(comicgoodoffsets.indexOf(comictimesToOffset),1);
                comicbadset = false;
                console.log("The remaning good offsets " + comicgoodoffsets);
            }
        }


        console.log(comic);
        comicTitleElements[i].innerText = comic.title;
        comicImgElements[i].src = comic.thumbnail.path + "." + comic.thumbnail.extension;
        comicLinkElements[i].href = "#";

        for(let comiclink of comic.urls)
        {
            if(comiclink.type == "detail")
            {
                comicLinkElements[i].href = comiclink.url;
                break;
            }
        }

    }
}

async function GetSeries(){
    //same setup as comics
    seriesIDs = [];
    let seriesoffset = 0;
    let seriesData = await fetch("https://gateway.marvel.com:443/v1/public/characters/"+ heroID + "/series?limit=" + limit +" &offset="+ seriesoffset +"&ts=1&apikey=" + publicAPIkey + "&hash=" + md5Hash)
        .then(response => response.json())
        .catch(e => console.log(e));
    console.log(seriesData);

    seriestotal = seriesData.data.total
    seriespossibleSearchTimes = Math.ceil(seriestotal/parseInt(limit));
    
    let seriesgoodoffsets = [];
    
    for(let i = 0; i < seriespossibleSearchTimes; i++)
    {
        seriesgoodoffsets.push(i);
    }

    let seriesbadset = false;
    for(let i = 0; i < 4; i++)
    {
        
        while(true)
        {

            if(seriesgoodoffsets.length == 0)
            {
                alert("ran out of series off sets");
                exit();
            }

            let seriestimesToOffset = seriesgoodoffsets[Math.floor(Math.random() * ((seriesgoodoffsets.length - 1) - 0 + 1)) + 0];

            seriesoffset = (parseInt(limit)  * seriestimesToOffset).toString();
            seriesData = await fetch("https://gateway.marvel.com:443/v1/public/characters/"+ heroID + "/series?limit=" + limit +" &offset="+ seriesoffset +"&ts=1&apikey=" + publicAPIkey + "&hash=" + md5Hash)
                .then(response => response.json())
                .catch(e => console.log(e));
            console.log(seriesData);


            let seriesrandomindexarray = [];
            for(let j = 0; j < seriesData.data.results.length; j++)
            {
                seriesrandomindexarray.push(j)
            }
            while(true)
            {
                console.log("here series");
                
                if(seriesrandomindexarray.length == 0)
                {
                    //get new set and store the bad set to not get it again
                    console.log("Bad Series on " + i);
                    seriesbadset = true;
                    break;
                }
                let index = seriesrandomindexarray[Math.floor(Math.random() * ((seriesrandomindexarray.length - 1) - 0 + 1)) + 0]
                seriesrandomindexarray.splice(seriesrandomindexarray.indexOf(index),1);
                series = seriesData.data.results[index];
                if(seriesIDs.indexOf(series.id) == -1 && series.type == "")
                {
                    seriesIDs.push(series.id);
                    break;
                }
            }

            if(!seriesbadset)
            {
                console.log("Good series on " + i);
                break;
            }
            else
            {
                //remove bad
                console.log("Remove Bad Off Set at space " + i + " with offset " + seriestimesToOffset);
                seriesgoodoffsets.splice(seriesgoodoffsets.indexOf(seriestimesToOffset),1);
                console.log("The remaning good offsets " + seriesoffset);
                seriesbadset = false;
            }
        }

        console.log(series);
        seriesTitleElements[i].innerText =series.title;
        seriesImgElements[i].src = series.thumbnail.path + "." + series.thumbnail.extension;
        seriesLinkElements[i].href = "#";

        for(let serieslink of series.urls)
        {
            if(serieslink.type == "detail")
            {
                seriesLinkElements[i].href = serieslink.url;
                break;
            }
        }
    }
    seriesIDs = []
}

const colorThief = new ColorThief();
console.log(backElement)

imgElement.crossOrigin = "Anonymous";
imgElement.addEventListener('load', function() {

    //change background and button based off of image of the character using Color Theif

    // let palette = colorThief.getPalette(imgElement);
    palette = colorThief.getPalette(imgElement);
    // backElement.style.background= "linear-gradient(to bottom, rgba(" + palette[0][0].toString() +","+ palette[0][1].toString() +","+ palette[0][2].toString() +",1.0), rgba(" + palette[1][0].toString() +","+ palette[1][1].toString() +","+ palette[1][2].toString() +",1.0));"
    if(toTrans)
    {
        backElement.style.background = "linear-gradient(0deg, rgba(" + palette[0][0].toString() +","+ palette[0][1].toString() +","+ palette[0][2].toString() +",1.0), rgba(" + palette[1][0].toString() +","+ palette[1][1].toString() +","+ palette[1][2].toString() +",1.0))";
        backElement.style.opacity = "1";

        // buttonBackElementTwo.style.background = "linear-gradient(90deg, rgba(" + palette[0][0].toString() +","+ palette[0][1].toString() +","+ palette[0][2].toString() +",1.0), rgba(" + palette[1][0].toString() +","+ palette[1][1].toString() +","+ palette[1][2].toString() +",1.0))";
        buttonBackElementTwo.style.background = "linear-gradient(" + buttonDeg.toString() + "deg, rgba(" + palette[0][0].toString() +","+ palette[0][1].toString() +","+ palette[0][2].toString() +",1.0), rgba(" + palette[1][0].toString() +","+ palette[1][1].toString() +","+ palette[1][2].toString() +",1.0))";
        buttonBackElementOne.style.opacity = "0";

        toTrans = false;
    }
    else
    {
        bodyElement.style.background = "linear-gradient(0deg, rgba(" + palette[0][0].toString() +","+ palette[0][1].toString() +","+ palette[0][2].toString() +",1.0), rgba(" + palette[1][0].toString() +","+ palette[1][1].toString() +","+ palette[1][2].toString() +",1.0))";
        backElement.style.opacity = "0";

        // buttonBackElementOne.style.background = "linear-gradient(90deg, rgba(" + palette[0][0].toString() +","+ palette[0][1].toString() +","+ palette[0][2].toString() +",1.0), rgba(" + palette[1][0].toString() +","+ palette[1][1].toString() +","+ palette[1][2].toString() +",1.0))";
        buttonBackElementOne.style.background = "linear-gradient(" + buttonDeg.toString() + "deg, rgba(" + palette[0][0].toString() +","+ palette[0][1].toString() +","+ palette[0][2].toString() +",1.0), rgba(" + palette[1][0].toString() +","+ palette[1][1].toString() +","+ palette[1][2].toString() +",1.0))";
        buttonBackElementOne.style.opacity = "1";


        toTrans = true;
    }
});


function buttonSwirl(){

    //Button's colors move on a interval
    if(toTransButton)
    {
        buttonBackElementTwo.style.background = "linear-gradient(" + buttonDeg.toString() + "deg, rgba(" + palette[0][0].toString() +","+ palette[0][1].toString() +","+ palette[0][2].toString() +",1.0), rgba(" + palette[1][0].toString() +","+ palette[1][1].toString() +","+ palette[1][2].toString() +",1.0))";
        buttonBackElementOne.style.opacity = "0";

        toTransButton = false;
    }
    else
    {
        buttonBackElementOne.style.background = "linear-gradient(" + buttonDeg.toString() + "deg, rgba(" + palette[0][0].toString() +","+ palette[0][1].toString() +","+ palette[0][2].toString() +",1.0), rgba(" + palette[1][0].toString() +","+ palette[1][1].toString() +","+ palette[1][2].toString() +",1.0))";
        buttonBackElementOne.style.opacity = "1";


        toTransButton = true;
    }
    buttonDeg = buttonDeg + 10;
    if(buttonDeg == 360)
    {
        buttonDeg = 0;
    }
}

GetChar();
window.setInterval(buttonSwirl, 500);
