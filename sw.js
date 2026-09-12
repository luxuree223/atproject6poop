/* 2K27 Old School Career V91 — presentation artwork + audited coach photos */
const CACHE_NAME='2k27-oldschool-presentation-v97';
const ARENA_IMAGES=[
'https://commons.wikimedia.org/wiki/Special:Redirect/file/Philips_Arena_outside.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/Fleet_Center_from_old_Central_Artery.agr.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/United_Center_Exterior.JPG?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/Jacobs_Field_Cleveland.JPG?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/American_Airlines_Center_outside.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/Denver_Pepsi_Center_1.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/Palace_Of_Auburn_Hills_Michigan.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/Oracle_Arena_exterior_1.JPG?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/Toyota_Center.JPG?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/ConsecoFieldhouse.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/Staples_Center_outside.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/PyramidArena.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/American_Airline_Arena_exterior.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bradley_Center.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/Target_Center.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/IZOD_Center.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/New_Orleans_Arena,_exterior_view,_10_January_2022.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/Madisonsquaregarden.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/TD-Waterhouse8.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/Wachovia_Center,_Philadelphia.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/AmericaWestArena.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/RoseGardenArenaPortland.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/Arcoarenakings.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/Att-center.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/KeyArena_Seattle.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/Air_Canada_Centre_in_1999.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/Delta-center.jpg?width=960',
'https://commons.wikimedia.org/wiki/Special:Redirect/file/MCI_Center.jpg?width=960'
];

const TEAM_LOGOS=[
'atl','bos','chi','cle','dal','den','det','gs','hou','ind','lac','lal','mem','mia','mil','min','nj','no','ny','orl','phi','phx','por','sac','sa','sea','tor','utah','wsh'
].map(ab=>`https://a.espncdn.com/i/teamlogos/nba/500/${ab}.png`);
const COACH_IMAGES=[
'bernie-bickerstaff','bill-cartwright','byron-scott','chris-ford','doc-rivers','don-chaney','don-nelson','eddie-jordan','eric-musselman','flip-saunders','frank-johnson','gregg-popovich','herb-williams','hubie-brown','jeff-bzdelik','jeff-van-gundy','jerry-sloan','jim-o-brien','john-carroll','johnny-davis','kevin-o-neill','larry-brown','lawrence-frank','lenny-wilkens','maurice-cheeks','mike-d-antoni','mike-dunleavy-sr','nate-mcmillan','paul-silas','pete-myers','phil-jackson','randy-ayers','rick-adelman','rick-carlisle','scott-skiles','stan-van-gundy','terry-porter','terry-stotts','tim-floyd'
].map(name=>`coach-photos/${name}.jpg`);
const PRESENTATION_IMAGES=[...ARENA_IMAGES,...TEAM_LOGOS,...COACH_IMAGES];
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    await Promise.allSettled(PRESENTATION_IMAGES.map(async url=>{
      try{
        const response=await fetch(url,{mode:'no-cors',cache:'no-cache'});
        await cache.put(url,response);
      }catch(_e){}
    }));
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>(k.startsWith('2k27-oldschool-arena-art-')||k.startsWith('2k27-oldschool-presentation-'))&&k!==CACHE_NAME).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const u=event.request.url;
  const isDynamicPresentation=/^https:\/\/(?:upload\.wikimedia\.org|commons\.wikimedia\.org)\//.test(u);
  const isBundledCoach=/\/coach-photos\/[^/]+\.jpg$/.test(new URL(u).pathname);
  if(!PRESENTATION_IMAGES.includes(u) && !isDynamicPresentation && !isBundledCoach) return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    const cached=await cache.match(event.request,{ignoreVary:true});
    if(cached) return cached;
    try{
      const live=await fetch(event.request);
      if(live) cache.put(event.request,live.clone()).catch(()=>{});
      return live;
    }catch(_e){
      return cached || Response.error();
    }
  })());
});
