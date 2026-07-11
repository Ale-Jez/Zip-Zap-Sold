00:00:00,820 --> 00:00:01,780 [Speaker 0]
Tu trzeba głośno mówić. 

00:00:09,260 --> 00:00:10,940 [Speaker 1]
Dobra. Słyszysz mnie szmato? 

00:00:12,280 --> 00:00:12,790 [Speaker 0]
Tak. 

00:00:12,790 --> 00:00:29,740 [Speaker 1]
On nie będzie odpowiadał. Nie, nie. Dobra, czyli tak. Pierwszym etapem w całym procesie zakupowym jest understanding, czyli dobre zrozumienie naszego człowieka, zrozumienie kim on jest oraz czego potrzebuje. I to chcemy zrobić, żeby było maksymalnie 

00:00:30,760 --> 00:00:48,120 [Speaker 1]
user-friendly. Więc nie chcemy robić jakichś kwestionariuszy typu forms, które są nudne, tylko nam zależy na tym, żeby przede wszystkim była rozmowa z, z naszym agentem i żeby ta rozmowa była mówiona. Więc tutaj wykorzystamy to voice OP, OpenAI Voice, jakkolwiek to się tam nazywa. 

00:00:48,120 --> 00:00:49,080 [Speaker 0]
Live coś tam, tak. 

00:00:49,080 --> 00:01:16,040 [Speaker 1]
Coś tam, coś tam, żeby powiedzieć. I tutaj, tutaj problemy jakie widzimy, że bardzo często ludzie nie wiedzą, co chcą dokładnie kupić. Dlatego musimy się skupić na tym, że człowiek podaje jakiś input typu chce kupić auto, a nasz agent musi znaleźć teraz pytania, żeby być w stanie dokładnie je zadać użytkownikowi i zrozumieć go lepiej. I tutaj chcemy zrobić kilka grup. 

00:01:16,040 --> 00:02:06,300 [Speaker 0]
Grup abstrakcyjnych. Te grupy abstrakcyjne będą dotyczyć różnych takich czynności związanych albo czynności, albo informacji związanych z danym produktem. Te grupy będą nam po to, ponieważ na podstawie każdej z tych grup zrobimy później pytania, które będziemy mogli zadać użytkownikowi w celu zebrania lepszych informacji o danym produkcie. Przykładowo, jak mamy samochód, chcemy kupić samochód, no to my za-za-zwracamy uwagę na grupę użyteczność, na grupę kolor, czyli emocjonalną grupę, na grupę personalną, na grupę cenową. I tak samo jest, i każdy produkt, który byś-- człowiek chce kupić, no to już jakby on wie na początku, bo ma w swojej głowie kilka tych grup zaprogramowanych. Natomiast my musimy to wyciągnąć, żeby agent czuł emocje człowieka i dzięki temu lepiej to wszystko rozumiał. 

00:02:09,340 --> 00:02:19,220 [Speaker 1]
Tak. Tak i te, te grupy muszą być abstrakcyjne, muszą być powtarzalne do-- tak, żeby one były aplikowane do różnych typów produktów. Myślę, że to później wymyślimy. Po prostu na razie zostawmy. 

00:02:19,220 --> 00:02:48,560 [Speaker 0]
Grupy muszą być uniwersalne. Grup nie musi być dużo, ale muszą być na tyle uniwersalne, żeby pozwoliły dobrze zrozumieć produkt. Ja myślę, że to będzie około sześciu grup, które pozwolą dobrze nam zrozumieć produkt. To jest tak, jak człowiek wchodzi na, na stronę internetową, widzi na przykład kolor, widzi kolor, widzi działa-- użyteczność, widzi cenę, widzi rekomendacje. Na to zwraca uwagę. I musimy znaleźć takich sześć grup abstrakcyjnych, które później każdy z agentów AI będzie bardziej szczegółowo dopytywał w kontekście pytań do tej grupy. 

00:02:48,560 --> 00:02:59,320 [Speaker 1]
Mhm, mhm. Tak, tak i ja jeszcze bym powiedział, że w tym kontekście mamy jeszcze takie dwa kluczowe pytania. Nie do końca o produkt, ale to jest tak: cena oraz 

00:03:00,700 --> 00:03:09,780 [Speaker 1]
dojazd. W sensie adres, na jaki to ma dojechać, czy to ma być stacjonarne. To, to są takie pytania, które też muszą być zadane. 

00:03:11,480 --> 00:03:14,600 [Speaker 0]
Tak. Czyli czy to ma być inpost, czy ma być tak? O to ci chodzi? 

00:03:14,600 --> 00:03:20,320 [Speaker 1]
Znaczy bardziej chodzi o to, że daję, że mój maksymalny budżet to jest sto złotych. 

00:03:21,700 --> 00:03:32,960 [Speaker 1]
Najbardziej chciałbym, żeby to było około osiemdziesiąt, ale powiedzmy, że mogę dać jeszcze te dwadzieścia, żeby właśnie było stówa. To jest pierwsze i na przykład masz, za żadne skarby masz nie przekraczać tych stu złotych, co nie? 

00:03:34,100 --> 00:03:41,940 [Speaker 1]
To jest jedna sprawa. A druga właśnie z tym dojazdem, że tam dla mnie na przykład nie interesuje mnie to, czy to będzie InPostem, Allegro Mart czy coś tam, ale po prostu, że to ma być- 

00:03:41,940 --> 00:03:43,560 [Speaker 0]
Spełnienie oczekiwań użytkownika. 

00:03:43,560 --> 00:03:49,520 [Speaker 1]
To ma być: ja mieszkam tutaj, ale po prostu to ma mi dotrzeć do punktu i znajdź po prostu tak 

00:03:50,580 --> 00:03:55,060 [Speaker 1]
jakieś najtańsze opcje dojazdu. No tyle. Ale po prostu żeby ten dojazd i 

00:03:56,240 --> 00:03:58,200 [Speaker 1]
hajs były. 

00:03:58,200 --> 00:03:58,640 [Speaker 0]
Tak. 

00:03:58,640 --> 00:03:59,900 [Speaker 1]
Też jakby spytane, nie? 

00:03:59,900 --> 00:04:18,360 [Speaker 0]
I co jest ważne, to jest jakby pierwszy etap naszego projektu, bo to jest na hackathon i to jest pierwszy temat, ponieważ kolejnym tematem, bo-- i to jest understanding i my chcemy z understandingu zrobić już cały profil i więcej już nie musieć dopytywać człowieka, tylko przejść do kwestii płatnościowych. 

00:04:18,360 --> 00:04:25,840 [Speaker 1]
Tak. I to, co też ważne, żeby jak robimy teraz te pytania i zapisujemy to, żeby tworzyła się przy tym persona tego człowieka- 

00:04:25,840 --> 00:04:26,220 [Speaker 0]
Tak. 

00:04:26,220 --> 00:04:38,460 [Speaker 1]
I jak on będzie później wracał i kupował jeszcze coś raz, to już nie będziemy musieli zadawać jeszcze raz tych samych pytań, tylko po prostu możemy powiedzieć to, co zwykle. Tak? To samo co wcześniej. Dzięki czemu ten proces jeszcze będzie bardziej zautomatyzowany, co nie? 

00:04:38,460 --> 00:04:59,980 [Speaker 0]
Tak. Czyli budujemy albo digital twin, albo jakąś grafową sieć predykcyjną, która będzie po prostu dopasowywała nam, dopasowywała do człowieka i będziemy dużo lepiej rozumieć każdy aspekt tego człowieka i nie będziemy musieli. Cały proces będzie po prostu bardziej user-friendly, nie? Czyli zbieramy wszystkie informacje. Dobra, teraz tak, to co kolejny krok. 

00:05:01,200 --> 00:05:05,660 [Speaker 1]
Myślę, że już tutaj understanding idą właśnie żeby, żeby to było angażujące. No ale myślę, że 

00:05:07,040 --> 00:05:15,300 [Speaker 1]
nooo ja rozumiem, że kwestionariusze są nudne, ale rozmowa, no myślę, że rozmowa to jest naj-najprzyjemniejszy sposób. Dalej nie da tego- 

00:05:15,300 --> 00:05:43,460 [Speaker 0]
Tym bardziej że bierzemy pod uwagę, że każdy człowiek umie rozmawiać i każdy człowiek uważa rozmowę za coś bardzo konkretnego. I nawet takie rozwiązania w ogóle tak pomyślałem, to może być coś takiego, że możesz mieć na chacie, tak? Nie wiem, dogsie takie co nie, że po prostu rozmawiasz z jakby w domu. Mówisz kup mi taki i taki produkt, bo potrzebuję to i to. I to jest o tyle dobre, że rozmowę możesz przeprowadzić zmywając naczynia czy prasując rzeczy, a nie musisz typować na telefonie. 

00:05:43,460 --> 00:05:51,460 [Speaker 1]
O! To jest mega ważne. My-- to musi być tak uniwersalne rozwiązanie, że my nie zwracamy, że nie zabiera nam czasu, tylko po prostu nam pomaga. Mega, mega nam. 

00:05:52,480 --> 00:05:55,000 [Speaker 1]
Uznajemy, że chcemy być jak najbardziej leniwi. 

00:05:55,000 --> 00:06:08,380 [Speaker 0]
To możemy nawet zrobić stary taką scenkę, że coś tam robię rękoma, nie wiem, nawet sprzątam na scenie i w trakcie tego po prostu odpalam laptop-- znaczy ten telefon i do niego mówię i ja w trakcie sprzątam, co nie? Żeby było to pokazane. 

00:06:08,380 --> 00:06:10,120 [Speaker 1]
Albo robisz pompki. 

00:06:10,120 --> 00:06:10,740 [Speaker 0]
Cokolwiek no. 

00:06:10,740 --> 00:06:13,840 [Speaker 1]
Pompki i mówisz: ale bym potrzebował takiego hantla dwadzieścia kilogramów, co nie? 

00:06:13,840 --> 00:06:14,900 [Speaker 0]
Może być, co nie? 

00:06:14,900 --> 00:06:16,300 [Speaker 1]
I o, i to już jest super. 

00:06:16,300 --> 00:06:16,820 [Speaker 0]
No. 

00:06:16,820 --> 00:06:19,960 [Speaker 1]
A tak, a ty tak wiesz, robisz dalej pompki, co nie? A to było zajebiste. 

00:06:19,960 --> 00:06:22,120 [Speaker 0]
Dosłownie. No to jest fajne. 

00:06:22,120 --> 00:06:24,640 [Speaker 1]
Albo przysiady później. Zajebiste. 

00:06:24,640 --> 00:06:27,400 [Speaker 0]
No ale fajnie się, mega podoba. 

00:06:27,400 --> 00:06:33,599 [Speaker 1]
Pytanie czy zatrzymywać teraz to? Zobaczymy czy w ogóle wszystko dobrze się zapisało i będziemy po prostu łączyć. 

00:06:33,600 --> 00:06:37,410 [Speaker 0]
Może tak. Tak. O! I mam jeszcze lepszy pomysł. Dam, od razu ci to wysyłam00:00:00,080 --> 00:00:00,780 [Speaker 0]
Znaleźć to. 

00:00:02,140 --> 00:00:02,700 [Speaker 0]
Czyli de facto- 

00:00:02,700 --> 00:00:03,020 [Speaker 1]
Let's go. 

00:00:05,440 --> 00:00:06,080 [Speaker 0]
Dobra. Tak. 

00:00:07,200 --> 00:00:09,440 [Speaker 0]
Mamy pierwszy punkt. Mamy pierwsze understanding. 

00:00:09,440 --> 00:00:12,400 [Speaker 1]
Teraz przechodzimy do kolejnego punktu, który będzie discover. 

00:00:12,400 --> 00:00:12,620 [Speaker 0]
Mhm. 

00:00:14,140 --> 00:00:19,340 [Speaker 0]
W fazie discover jesteśmy już po understanding. Czyli agent wie, czego człowiek potrzebuje 

00:00:20,480 --> 00:00:23,620 [Speaker 0]
i teraz po prostu potrzebuje znaleźć to na internecie, 

00:00:25,360 --> 00:00:27,200 [Speaker 0]
tak żeby później sobie porównać 

00:00:28,980 --> 00:00:32,220 [Speaker 0]
i żeby później w kolejnej fazie podjąć wybór. 

00:00:32,220 --> 00:00:36,100 [Speaker 1]
Czyli prawda jest taka, że musimy znowu znaleźć jakby 

00:00:37,120 --> 00:00:42,840 [Speaker 1]
ścieżki dla agentów, żeby każdy agent szukał tego produktu pod innymi kryteriami. 

00:00:44,340 --> 00:00:58,600 [Speaker 1]
Czy tutaj też, bo tak dostajesz piłka czerwona, fajna, różowa ten. Piłkę możesz znaleźć na Amazonie, piłkę możesz znaleźć na Media Markt. Piłkę możesz znaleźć gdzieś indziej, co nie? I teraz pytanie czy nie powinniśmy zrobić takiego, że daj nam... 

00:00:59,700 --> 00:01:19,460 [Speaker 1]
Czy powinniśmy właśnie wykorzystać web searcha od OpenAI, żeby on sam nam znalazł piłkę najlepszą? I to działa to bardzo dobrze, więc może faktycznie to będzie najlepsze rozwiązanie, ale też zależy nam na tym, żeby była dobra cena. Dobra cena, żeby była. Na czym jeszcze nam zależy? Dobra cena, żeby produkt był jakościowy, żeby to nie był scam i żeby to była zaufana strona. 

00:01:19,460 --> 00:01:27,360 [Speaker 0]
I dowóz, bo pamiętam, że oni też w jednym momencie powiedzieli, że na przykład potrzebuję to na jutro. No to jeżeli potrzebujesz to na jutro, to wtedy na przykład cena może być wyższa. 

00:01:28,380 --> 00:01:32,960 [Speaker 0]
Wtedy to właśnie, ale to w tym understanding to na przykład się dowiadujemy o tym. 

00:01:32,960 --> 00:01:43,480 [Speaker 1]
Tak, czyli musimy do understandingu dodać to, że rozumiemy potrzeby też ludzkie, czyli że ważni-- czasami ważniejsza jest czas dojazdu niż cena. 

00:01:45,100 --> 00:01:59,840 [Speaker 0]
Tak, ale to, to już mamy to w understandingu. Spojrzenie, podjęcie wyboru. Ale generalnie no dobra, jeżeli mówisz, że ten web searching, scraping, czy jak to tam się nazywa. No bo do-dosłownie ten etap polega na tym, że scrapujesz z różnych stron i porównujesz no wedle tych kryteriów. 

00:01:59,840 --> 00:02:05,520 [Speaker 1]
Tak. Tylko teraz kwestia jest taka, że nie na każdą stronę można wejść i sprawdzić cen. 

00:02:05,520 --> 00:02:05,660 [Speaker 0]
No. 

00:02:06,780 --> 00:02:11,480 [Speaker 1]
Nie każdą stronę można sprawdzić, nie każdą stronę można sprawdzić, czy jest rozmiar na przykład butów. 

00:02:11,480 --> 00:02:12,840 [Speaker 0]
No tak. 

00:02:12,840 --> 00:02:19,420 [Speaker 1]
To jest pierwsze problemy. To są pierwsze problemy, które musimy rozwiązać. Czyli nie na każdą stronę można sprawdzić. Na każdej stronie można sprawdzić wszystkie szczegóły. 

00:02:21,100 --> 00:02:21,540 [Speaker 1]
Co jeszcze? 

00:02:23,300 --> 00:02:38,760 [Speaker 1]
No bo teraz tak on zrobi web searcha i będzie szukał produktu według understandingu. Czyli agent musi też rozumieć, czego szuka. Czyli dobrze sobie zbudować kryteria poszukiwań, które muszą być walidowane. 

00:02:38,760 --> 00:02:38,880 [Speaker 0]
No. 

00:02:40,120 --> 00:02:52,360 [Speaker 1]
Czyli najlepiej w tym flow w discovery będzie to, żeby rozbudować to, że każdy daje agent swoją propozycję i ta propozycja, która będzie na przykład powielona przez kilka agentów, będzie najlepsza. 

00:02:54,200 --> 00:02:55,880 [Speaker 0]
Aha, czyli że puszczasz kilka 

00:02:56,900 --> 00:03:00,320 [Speaker 0]
i kilka niezależnie od siebie robią research i później- 

00:03:00,320 --> 00:03:02,260 [Speaker 1]
I każdy ma delikatnie inny kontekst może. 

00:03:02,260 --> 00:03:03,200 [Speaker 0]
Okej, dobra. 

00:03:03,200 --> 00:03:14,269 [Speaker 1]
Znaczy kontekst ogólny, że to ma być buty takie i takie to jest ten, ale każdy niech szuka pod trochę innym na przykład pod cena, bo też to takie kryteria: cena czy rozmiar jest, czy kolor jest. Co nie? To są takie kryteria na przykład. 

00:03:14,269 --> 00:03:19,020 [Speaker 0]
Czy strona jest na przykład reliable. W sensie czy to jest jakiś Amazon, czy jakiś dupy Janusz. 

00:03:19,020 --> 00:03:23,040 [Speaker 1]
Tak. Czy cena tak. Musimy, czyli musimy znowu znaleźć czterech agentów. 

00:03:23,040 --> 00:03:34,260 [Speaker 0]
Czyli masz różnych agentów, którzy różnie szukają i później jak masz punkty to wyciągasz z nich taki coś w typu średnią albo to coś- 

00:03:34,260 --> 00:03:37,700 [Speaker 1]
Tak, waga, waga, priorytetowa żona czy coś. 

00:03:38,720 --> 00:03:42,420 [Speaker 0]
Kurwa, to fajne. To też jest jeden ze sposobów uczenia. W sensie- 

00:03:42,420 --> 00:03:44,500 [Speaker 1]
Tak. Learning from experience, tak? 

00:03:44,500 --> 00:03:52,840 [Speaker 0]
Nie, nie, nie, nie o to mi chodziło, ale że, że właśnie masz takie, że no masz kilka niezależnych i z tego wyciągasz, co się najbardziej powtarza. To chyba kurwa w jakimś foreście było. 

00:03:52,840 --> 00:03:53,760 [Speaker 1]
A co najlepsze 

00:03:55,200 --> 00:03:57,280 [Speaker 1]
z understandingu możemy wyciągnąć wagi. 

00:03:57,280 --> 00:04:00,390 [Speaker 0]
To w foreście było. No tak, to było random forest chyba. 

00:04:00,390 --> 00:04:03,260 [Speaker 1]
A random forest, że chodzi ci losowe dzielenie- 

00:04:03,260 --> 00:04:10,860 [Speaker 0]
Las losowy, że masz drzewa, bo wiesz jak jest drzewa, co nie? Że on podejmuje jakieś tam wybory, a las jest taki, że masz dużo tych drzew i z tego się coś wyciąga. 

00:04:10,860 --> 00:04:23,000 [Speaker 1]
Znaczy tam badają na podstawie odległości, czyli jak blisko są od siebie dane produkty i wtedy dzieli na przykład ten ucina i zależny las działa też na zasadzie tej odległości. 

00:04:23,000 --> 00:04:27,900 [Speaker 0]
No dobra, po prostu efekt jest taki, że agenty będą mieć różne- 

00:04:27,900 --> 00:04:28,300 [Speaker 1]
Tak. 

00:04:30,340 --> 00:04:31,700 [Speaker 0]
Różne tak wyniki. 

00:04:31,700 --> 00:04:50,180 [Speaker 1]
Tak różne wyniki. I teraz tak to, co teraz rozmawialiśmy o random forest, no to był taki tylko taka ciekawostka. Natomiast chodzi nam o to, żeby każdy z agentów miał różne wyniki i tym wynikom będziemy dawać jakoś wagę, a wagę będziemy brali z understandingu i dzięki temu będziemy mieli lepsze dopasowanie, który produkt bardziej pasuje do użytkownika. 

00:04:51,580 --> 00:04:59,700 [Speaker 1]
Bo będzie efektem będzie kilka produktów, ale ten, który pojawi się najczęściej albo będzie miał najwyższą wagę, to znaczy, że ten będzie najlepszy, co nie? 

00:05:01,780 --> 00:05:02,680 [Speaker 0]
Fajne. Podoba mi się. 

00:05:04,840 --> 00:05:06,560 [Speaker 0]
Dobra, to zatrzymujemy ten etap? 

00:05:09,000 --> 00:05:10,590 [Speaker 1]
To poczekaj, zatrzymam i najwyżej dogramy nanti.00:00:01,079 --> 00:00:43,639 [Speaker 0]
No dobra, bo mówiliśmy o problemie, o tym, że czasem nie można zescrapować informacji ze strony, yy, i albo się w ogóle nie da wejść na stronę, jest zablokowana, albo nie da się, yy, znaleźć informacji, na przykład rozmiar buta. Yy, czyli de facto wtedy się tego nie da za-zaautomatyzować. Yy, i mnie to teraz zastanawia, bo jedyne rozwiązanie, jakie widzę, to to, że zwrócić użytkownikowi informację, że z tego, co ja znalazłem, to jest to opcja A jest najlepsza, ale na stronie Z, yy, nie mogę wejść i tam może być coś lepszego, yy, ale jestem ograniczony. Nie mogę tego sprawdzić, więc ty możesz zrobić to samemu. 

00:00:43,639 --> 00:00:44,459 [Speaker 1]
Tak. 

00:00:44,459 --> 00:01:01,079 [Speaker 0]
Albo po prostu, yy, dajesz mi, że ja po prostu kupuję tam, gdzie mam dostęp. No bo jeżeli agent nie ma dostępu, bo może to być zablokowane, no to nie zautomatyzujesz tego. Musi być człowiek. Yy, więc może być po prostu takie, wiesz, notyfikacja. 

00:01:01,079 --> 00:01:01,840 [Speaker 1]
Mhm. 

00:01:01,840 --> 00:01:14,760 [Speaker 0]
Bo ja też kurde, ja bym, wiecie co, ja bym poszedł spróbować znaleźć. Bo mnie to zastanawia ten user staying in control at every step. W sensie jak to rozumieć? No bo jeżeli mamy to oddać, że cały agent ma zrobić to, no to jak ma być user w kontroli, co nie? 

00:01:16,500 --> 00:01:16,799 [Speaker 1]
Aha. 

00:01:18,099 --> 00:01:19,259 [Speaker 0]
Jak to interpretować? 

00:01:19,259 --> 00:01:25,979 [Speaker 1]
Możesz zapytać i oni ci powiedzą, że pewnie chodzi o to, żeby wymyślić coś. 

00:01:25,979 --> 00:01:30,959 [Speaker 0]
Ale się. Ale spytam, no bo właśnie na przykład czy, czy tam ma się coś pokazywać? 

00:01:30,959 --> 00:01:34,739 [Speaker 1]
Tylko nie musisz się martwić, co oni odpowiedzą. Jak powiedzą, że wymyśl się coś, no to-00:00:00,599 --> 00:00:01,779 [Speaker 0]
Jakbyś powtórzył to swoje? 

00:00:01,779 --> 00:00:07,279 [Speaker 1]
Ja wiem co? Pierwsze uruchomienie przekroczyło limit czasu podczas pobierania z inicjalizacji modelu. 

00:00:08,380 --> 00:00:10,219 [Speaker 0]
Yy Arek, idź do tego Tima. 

00:00:10,219 --> 00:00:11,099 [Speaker 1]
Taa 

00:00:11,099 --> 00:00:14,239 [Speaker 0]
Żeby dał ci coś do tego, co zamienić dobrze na tekst. 

00:00:14,239 --> 00:00:16,600 [Speaker 1]
Dobra, on niech się spinuje. Próbuje po raz kolejny. 

00:00:16,600 --> 00:00:17,540 [Speaker 0]
Ale ty możesz laptop wziąć00:00:00,560 --> 00:00:03,380 [Speaker 0]
To tak. Chodzi o fazie discover. 

00:00:04,640 --> 00:00:05,280 [Speaker 0]
Tak naprawdę 

00:00:06,400 --> 00:00:08,020 [Speaker 0]
w jakiejkolwiek fazie 

00:00:09,360 --> 00:00:16,100 [Speaker 0]
nasz agent może czasem potrzebować jakichś jeszcze dodatkowych informacji od nas i potrzebuje sposobu, żeby się skomunikować. I możemy 

00:00:17,460 --> 00:00:26,240 [Speaker 0]
skomunikować się, w sensie on może do nas zadzwonić, żeby zadać dodatkowe pytania tak, żeby on nie czekał, żeby to szło dalej. 

00:00:26,240 --> 00:01:05,820 [Speaker 1]
Chodzi o to, że człowiek, żeby człowiek nie musiał czekać w tym flow, tylko żeby on na spokojnie mielił w swoim czasie. To nie musi być na już, że w ciągu dziesięciu sekund musimy znaleźć produkt. Niech to będzie w swoim czasie, niech to będzie dobrze zrobione, a w miarę pytań na przykład czy, bo słuchaj, mamy taki case na przykład mamy kilka case'ów. Pierwszy case jest taki na przykład, że OK, mamy- mam tu dziesięć produktów. Trzeci jest najlepszy aktualnie, bo do pierwszego i drugiego nie mam dostęp-- nie ma aktualnie w sklepie tego. Więc czy czekamy, czy kupujemy ten? Czy zależy ci na czasie, czy nie? Albo jest inny case, że na przykład danego dnia z najgorszych będzie najlepszy dany produkt, ale ten produkt na jutro może być na przykład najgorszy z najlepszych. 

00:01:07,460 --> 00:01:12,380 [Speaker 1]
Więc my chcemy po prostu mieć taką informację, że wraca do ciebie call i mówi, że słuchaj, 

00:01:14,660 --> 00:01:30,760 [Speaker 1]
słuchaj, taka i taka sytuacja, że musisz dogadać się ze mną, czy to na pewno spełnia twoje oczekiwania. I może to-- i ja proponuję, żebyś dał nam kilka takich opcji rozwiązania, bo możesz zadzwonić na telefon, ale to nie wiem, czy każdy będzie chciał, ale może jakieś inne. To też na pewno jest dużo takich ciekawych opcji. 

00:01:30,760 --> 00:01:32,030 [Speaker 0]
Po prostu SMS. 

00:01:32,030 --> 00:01:35,400 [Speaker 1]
SMS, WhatsApp, pushup jakiś. 

00:01:35,400 --> 00:01:48,740 [Speaker 0]
Tak. Po prostu poinformować. Bo generalnie co do idei szukamy takiego rozwiązania, które będzie, że ten agent będzie autonomiczny. I na-naszą rolą też tutaj, w tym procesie myślenia, jest ustalenie granicy, gdzie, 

00:01:49,880 --> 00:01:56,340 [Speaker 0]
znaczy jak bardzo ten człowiek może ingerować. No i my uważamy, że są takie po prostu, takie momenty, że ten człowiek faktycznie musi dać swój input, 

00:01:57,860 --> 00:02:10,699 [Speaker 0]
że to jest istotne. Chyba że możemy też dać takie inne ustawienie, że po prostu człowiek powie, że nie interesuje mnie to, masz to zrobić. Jak zrobisz, to tak będzie, bo też, też niektórzy ludzie na pewno będą tak chcieli. To też spoko, więc musimy dać 

00:02:13,040 --> 00:02:15,920 [Speaker 0]
możliwość człowiekowi ustalenia, gdzie ona granica. 

00:02:15,920 --> 00:02:38,800 [Speaker 1]
Czyli może takie rzeczy właśnie też dodać w temacie szukania produktu, czyli tym understandingu, że tam też jeszcze były informacje o tym, że jakie pytania zadać użytkownikowi. Może to też znajdziemy taką grupę pytań, które warto zadać użytkownikowi, żeby mieć ogólnie informację o tym, bo to też takie lewe przypadki. 

00:02:38,800 --> 00:02:40,180 [Speaker 0]
Co to znaczy ogólnie informacje o tym? 

00:02:40,180 --> 00:02:47,640 [Speaker 1]
Bo jak na przykład masz understanding, masz x grup, no to jedną grupą może być czas realizacji na przykład albo jakoś takie 

00:02:48,920 --> 00:03:02,060 [Speaker 1]
przypadki, przypadki, takie krzywe przypadki czy coś takiego. I wtedy dopytujesz: a co jeśli ten produkt będzie najgorszy z najlepszych, ale jutro będzie lepszy? Albo co jeśli ten produkt będzie niedostępny, czy czekamy, czy nie? Tego typu rzeczy. 

00:03:03,340 --> 00:03:10,840 [Speaker 0]
Aha, dobra. Czyli na przykład, czyli w fazie understanding chat agent pyta, czy chcesz mieć to teraz, czy na przykład 

00:03:12,240 --> 00:03:17,400 [Speaker 0]
możesz poczekać parę dni, a ja spróbuję przewidzieć, czy na przykład za dwa dni będzie lepsza cena? Okej. 

00:03:17,400 --> 00:03:29,000 [Speaker 1]
Albo on już sam przewidzi, że może jest jakoś dostępność, że może w przeciągu trzydziestu dni będzie lepsza cena czy coś. Jeśli ci na tym zależy. Na pewno w jakiś sposób to można koncepcyjnie predykcyjnie zrobić. 

00:03:29,000 --> 00:03:32,920 [Speaker 0]
Mhm. Okej, dobra. Okej, rozumiem. To jest do... 

00:03:35,100 --> 00:03:40,380 [Speaker 0]
Ale dobra, czy to jest do fazy discover czy approve? Dobra, mamy. 

00:03:40,380 --> 00:03:40,820 [Speaker 1]
Dobra, mamy. 

00:03:43,280 --> 00:03:43,390 [Speaker 2]
[głosy w tle]00:00:00,100 --> 00:00:00,900 [Speaker 0]
Jeszcze approve'a 

00:00:00,900 --> 00:00:03,240 [Speaker 1]
A nie w sumie nie, żebyśmy mogli decide, co nie? 

00:00:04,580 --> 00:00:10,540 [Speaker 0]
Znaczy approve to możemy podsumować tak gdzieś jak, a decide, decide no to to jest approve. 

00:00:10,540 --> 00:00:13,139 [Speaker 1]
Nie, masz decide i approve masz. 

00:00:13,140 --> 00:00:13,480 [Speaker 0]
Aha. 

00:00:14,620 --> 00:00:15,940 [Speaker 0]
Czekaj, discover. 

00:00:15,940 --> 00:00:17,180 [Speaker 1]
Discover, decide, approve. 

00:00:18,620 --> 00:00:36,790 [Speaker 0]
No dobra, to powiemy. Jeszcze przed approve musimy mieć jeszcze etap decide. Decide jest związany z tym, że musimy zebrać na przykład od kilku agentów, ee, produkty. Oni dadzą nam różne produkty. Musimy wyciągnąć jakąś wagę, ważność tych produktów. 

00:00:36,790 --> 00:00:38,400 [Speaker 1]
Weźmy discovery. 

00:00:38,400 --> 00:00:42,840 [Speaker 0]
Okej, czyli decide, czyli wybieramy po prostu, który produkt jest najlepszy. 

00:00:42,840 --> 00:00:43,040 [Speaker 1]
No. 

00:00:43,040 --> 00:00:56,460 [Speaker 0]
Czyli ja uważam, że decide to jest ten etap, w którym my w razie czego dzwonimy albo kontaktujemy się z naszym użytkownikiem w celu potwierdzenia różnych nieścisłości. Jeśli pojawią się jakieś nieścisłości. 

00:00:56,460 --> 00:00:58,660 [Speaker 1]
Czyli decide czy approve. Dla mnie to- 

00:00:58,660 --> 00:01:04,340 [Speaker 0]
Approve to, że po prostu już kupujemy, idziemy do kupowania. Czyli mamy już-- no to możemy połączyć w jedno, w jedno. 

00:01:04,340 --> 00:01:06,570 [Speaker 1]
Bo masz później purchase, czyli- 

00:01:06,570 --> 00:01:06,610 [Speaker 0]
Czyli purchase 

00:01:06,610 --> 00:01:12,580 [Speaker 1]
... bo masz decide, approve, purchase. Ja bym powiedział, że decide to jest, że model sam ze sobą wybiera coś. 

00:01:13,640 --> 00:01:15,140 [Speaker 1]
W approve człowiek potwierdza, 

00:01:16,280 --> 00:01:19,960 [Speaker 1]
jeżeli człowiek będzie chciał potwierdzić, a w purchase no to agent robi. 

00:01:19,960 --> 00:01:28,520 [Speaker 0]
I to jest mega ważne. Jeśli człowiek będzie chciał potwierdzić, bo jeśli człowiek nie będzie chciał potwierdzić, a to dobierzemy informację od niego na podstawie jego profilu- 

00:01:28,520 --> 00:01:29,160 [Speaker 1]
Understanding 

00:01:29,160 --> 00:01:41,760 [Speaker 0]
... understanding, to wtedy po prostu, jeśli, yy, po prostu kupujemy najlepszy produkt, który uznajemy, a w miarę takich mocnych nieścisłości z nim się kontaktujemy. Ale jeśli zaznaczy, że nie kontaktujemy się, to kurwa się nie kontaktujemy. 

00:01:41,760 --> 00:01:42,160 [Speaker 1]
Tak. 

00:01:44,240 --> 00:01:47,560 [Speaker 1]
Dobra. No to w sumie jest decide i approve tak to zrobione. 

00:01:47,560 --> 00:01:49,640 [Speaker 0]
Tak. No i dobra, teraz tak. 

00:01:51,440 --> 00:01:51,570 [Speaker 0]
Mm, 

00:01:52,800 --> 00:01:54,240 [Speaker 0]
czyli mamy approve. 

00:01:54,240 --> 00:01:54,620 [Speaker 1]
Mhm. 

00:01:54,620 --> 00:01:56,340 [Speaker 0]
Tak? No i dobra, i teraz tak. 

00:01:56,340 --> 00:01:59,610 [Speaker 1]
Discover, decide, approve, no. 

00:01:59,610 --> 00:02:04,080 [Speaker 0]
Głównym celem naszego hackathonu jest to, żebyśmy w jakiś sposób zautomatyzowali payments- 

00:02:04,080 --> 00:02:04,270 [Speaker 1]
Tak 

00:02:04,270 --> 00:02:06,080 [Speaker 0]
... w taki sposób, żeby- 

00:02:06,080 --> 00:02:07,300 [Speaker 1]
Cz-czyli chodzimy teraz do purchase 

00:02:07,300 --> 00:02:47,390 [Speaker 0]
... tak, żeby agenty same kupowały produkty, same to robiły, miały nasze dane, naszą kartę kredytową lub coś. Jakoś fajnie to wymyślić trzeba, co nie? Że agenty same robią, ee, zakupy. No i teraz tak: musi to robić sam, czyli bez naszej wiedzy. Musi sam mieć odpowiednie informacje, bo jak kupujemy produkt, to musimy mieć informację, gdzie to kupić, jakim, jakim dostawcą. Yy, czy to w ogóle jest w obrębie naszego kraju, czy, czy to, czy jakieś cło w to wchodzi. Yy, po prostu chcemy tak pomóc człowiekowi, żeby sprawiło mu to jak najmniej kłopotów, czyli zautomatyzować cały proces kupowania. 

00:02:47,390 --> 00:02:48,620 [Speaker 1]
No. 

00:02:48,620 --> 00:02:51,860 [Speaker 0]
Czyli to jest purchase, purchase, purchase? Jak to się mówi? 

00:02:51,860 --> 00:02:52,360 [Speaker 1]
Purchase. 

00:02:52,360 --> 00:03:15,060 [Speaker 0]
Purchase. I teraz tak: musimy mieć informację, jak duża cena jest, ile człowiek jest w stanie wydać. Ale to wszystko już było w approve. Czyli po prostu musimy do tej, do sekcji purchase musimy znaleźć AI agentów albo jakieś MCP serwery, albo coś, co jest w stanie na daną stronę wejść i dokonać płatności za nas. 

00:03:16,140 --> 00:03:16,180 [Speaker 1]
Tak. 

00:03:16,180 --> 00:03:20,380 [Speaker 0]
To jest, to jest to, co chcemy wykonać, czyli zautomatyzować proces płatności. 

00:03:20,380 --> 00:03:27,480 [Speaker 1]
Ta jakby faza purchase to jest stricte techniczna, jakby człowiek tutaj już nic nie ma. Wszystko już pewne. Po prostu teraz już wykonywanie. 

00:03:27,480 --> 00:03:34,820 [Speaker 0]
Tak. Natomiast tutaj pojawią się pewnie też jakieś pytania, w jaki sposób to chcemy zrobić, bo my to chcemy zrobić z efektem wow. Cały ten projekt musi być z efektem wow, co nie? 

00:03:35,920 --> 00:03:37,360 [Speaker 0]
Więc tak to wygląda. 

00:03:39,300 --> 00:03:41,720 [Speaker 0]
Yy, to co? To tyle o tym purchase? 

00:03:41,720 --> 00:03:51,080 [Speaker 1]
No ja bym to sobie powiedział, bo to jest dosłownie techniczna. Ja na przykład nie wiem jak działają te, to co mówię, że ten agent, który ma niby kupować. Nie wiem, czy to faktycznie działa czy nie, to po prostu trzeba znaleźć, yy- 

00:03:51,080 --> 00:03:51,480 [Speaker 0]
Tak 

00:03:51,480 --> 00:03:52,200 [Speaker 1]
... jak to działa- 

00:03:52,200 --> 00:03:53,070 [Speaker 0]
Bo my nie mamy kupić 

00:03:53,070 --> 00:04:01,320 [Speaker 1]
... bo tu nawet nie ma co kminić. W sensie, bo to ja nawet nie widzę jakiegoś kreatywnego podejścia, no bo to jest po prostu kupno i tyle. Masz to zrobić, po prostu to wykonaj, co nie? 

00:04:01,320 --> 00:04:05,560 [Speaker 0]
Tak. Mm, czyli tak naprawdę, jeśli dobrze rozumiem, jak coś, to mnie popraw. 

00:04:05,560 --> 00:04:05,680 [Speaker 1]
Mhm. 

00:04:06,720 --> 00:04:17,100 [Speaker 0]
W całym kon-- cały kontekst naszego projektu opiera się na tym, że chcemy zautomatyzować kupno produktów, które najbardziej spełnią oczekiwania klientów. 

00:04:17,100 --> 00:04:17,820 [Speaker 1]
Tak. 

00:04:17,820 --> 00:04:26,340 [Speaker 0]
Czyli chcemy automatyzować kupno warzyw, kupno śrubek, kupno samochodu, kupno produktów po-powtarzalnych, ale i unikalnych. 

00:04:28,060 --> 00:04:28,920 [Speaker 0]
Tak że- 

00:04:28,920 --> 00:04:29,200 [Speaker 1]
Mhm 

00:04:29,200 --> 00:04:32,659 [Speaker 0]
... człowiek nie musiał brać, poświęcać czasu na bezsensowne szukanie- 

00:04:32,660 --> 00:04:32,940 [Speaker 1]
Tak 

00:04:32,940 --> 00:04:35,940 [Speaker 0]
... niepotrzebne systemy rekomendacji, niepotrzebne pomyłki. 

00:04:35,940 --> 00:04:53,640 [Speaker 1]
Tak, tak. I ale tutaj musimy się dużo-- mo-- ja myślę, że to nie jest kwestia teraz, żebyśmy my to w tej burzy mózgów, yy, pisali, tylko to jest po prostu taka kwestia właśnie techniczna. Yy, jak my to kupujemy, jaki dostęp z tą kartą? Yy, to są, no to są takie chuje pytania techniczne, co nie? 

00:04:54,969 --> 00:04:55,420 [Speaker 0]
Tak. 

00:04:55,420 --> 00:04:57,120 [Speaker 1]
Ja myślę, że to w ogóle pewnie Olek będzie, 

00:04:58,380 --> 00:04:59,160 [Speaker 1]
mm, mógł dobrze kminić. 

00:05:01,000 --> 00:05:02,350 [Speaker 0]
Dobra, czyli to będziemy musieli- 

00:05:02,350 --> 00:05:02,640 [Speaker 1]
Kupić 

00:05:02,640 --> 00:05:05,600 [Speaker 0]
... po-pomóc musi nam czat w tym też, co nie? ChatGPT. 

00:05:05,600 --> 00:05:12,000 [Speaker 1]
Dobra i takie, takie pytania to właśnie jak kupić, jaki agent do tego? Jak, yy, dać dostęp do płatności? 

00:05:12,000 --> 00:05:13,440 [Speaker 0]
Mhm. 

00:05:16,660 --> 00:05:19,720 [Speaker 1]
Yy. Właśnie na przykład waluta. Czy chcemy płacić, wiesz- 

00:05:19,720 --> 00:05:21,420 [Speaker 0]
To bardziej obręb kraju, co nie? 

00:05:22,480 --> 00:05:29,550 [Speaker 0]
Czyli czy produkt może być kupiony zza granicy, czy jednak wolimy, żeby produkt był kupiony w Polsce. 

00:05:29,550 --> 00:05:42,780 [Speaker 1]
Ale często jest tak, że jak coś kupujesz na przykład to też jest to no jakby bardzo specyficzny use case. Zabookuj mi hotel na, nie wiem, w Amsterdamie na tydzień w środku lipca. No to możesz zapłacić w euro albo w złotówkach na jakimś bookingu czy coś. 

00:05:42,780 --> 00:05:46,060 [Speaker 0]
Nie, ale bardziej mi chodzi po prostu o destynację tego, co chcemy kupić. 

00:05:46,060 --> 00:05:48,280 [Speaker 1]
A no tak, żeby ci nie jechało skądś. 

00:05:48,280 --> 00:05:51,850 [Speaker 0]
No ale w sumie chuj cię to interesuje. W sensie jeżeli ja powiem, że ma być, yy

00:05:53,284 --> 00:06:05,383 [Speaker 1]
On na przykład w temacie understanding odnośnie dostawy, że ja mieszkam na ulicy Kwiatowej i chcę tą paczkę mieć w tydzień, no to mnie nie interesuje, czy ona leci z Chin i przyleci helikopterem, czy leci z Radomia. Po prostu jakby to miejsce nie jest ważne, co nie? 

00:06:05,384 --> 00:06:14,724 [Speaker 0]
Tak. Czyli understanding musi też brać to pod uwagę, że miejsce musi dopytywać człowieka, czy my chcemy mieć to na już, czy nie. Ważne, żeby było- 

00:06:14,724 --> 00:06:15,284 [Speaker 1]
Czas. 

00:06:15,284 --> 00:06:22,234 [Speaker 0]
Ważny jest czas, ważne są pieniądze, ważny jest czas. Co tam jeszcze? Są różne takie ważne rzeczy. Na pewno wiesz, ChatGPT, bo to jest mega mądry. 

00:06:22,234 --> 00:06:22,454 [Speaker 1]
Dojazd. Yy, 

00:06:23,794 --> 00:06:39,424 [Speaker 1]
w sensie jaki typ dostarczenia, czy to ma być do paczkomatu, czy do mieszkania, czyli, yy, typ, yy, doja-- typ kuriera, koszt, ilość oraz czas na dojazd. To są takie pytania podstawowe odnośnie zakupu. Understanding, ee, tak. 

00:06:39,424 --> 00:06:39,884 [Speaker 0]
Tak. 

00:06:39,884 --> 00:06:48,684 [Speaker 1]
Purchase. Wracając do purchase, czy właśnie jak, jak, jak tą płatność wykonać, ale bym też dał, yy, jaka waluta. Tylko że to pytanie o walutę, 

00:06:50,084 --> 00:06:53,504 [Speaker 1]
mm, albo to może być jako ta notyfikacja, co nie? W trakcie. 

00:06:53,504 --> 00:06:54,204 [Speaker 0]
Tak. 

00:06:54,264 --> 00:06:57,244 [Speaker 1]
Bo to nie-- ja myślę, że pytanie o walutę nie, nie powtarza się super często. 

00:06:58,344 --> 00:07:27,483 [Speaker 0]
Mam super pomysł w ogóle. A co jeśli byśmy zrobili tak, że dajemy możliwość na przykład człowiekowi w takiej jakby notyfikacji mówimy: „OK, zaakceptowaliśmy ten projekt, produkt i chcemy go kupić”. I dajemy człowiekowi na przykład opcję w naszym systemie, że człowiek ma na przykład pięć minut takiego jakby czasu, że dostaje notyfikację i od pięciu minut, od-- ma do pięciu minut, żeby wejść, w razie czego coś zmienić. 

00:07:27,484 --> 00:07:28,284 [Speaker 1]
No. 

00:07:28,284 --> 00:07:51,494 [Speaker 0]
Czyli na przykład, żeby nie było tak, że wszystko automatycznie się dzieje na backgroundzie, ale człowiek śledzi, co się dzieje. On dostaje powiadomienia jak na InPoście na przykład. Dostaje powiadomienie, czyli, yy, dostaje-- chce kupić to-- ty jako agent. Agent mówi, że chce kupić ten produkt. No i wysyła informację, że to będzie finalne. Wypełnione są papiery i pyta: „Czy chcesz coś jeszcze sprawdzić, czy coś?”. 

00:07:51,494 --> 00:07:51,504 [Speaker 1]
No. 

00:07:51,504 --> 00:08:00,404 [Speaker 0]
No, jeśli użytkownik powie, że nie chce, no to kupuje. Albo ten mi-limit pięciu minut minie, bo tam człowiek będzie musiał dać albo tak, albo nie. 

00:08:00,404 --> 00:08:01,764 [Speaker 1]
Nawet w ustawieniach konta może sobie- 

00:08:01,764 --> 00:08:03,964 [Speaker 0]
Tak, w ustawieniach konta jakoś musimy to, to wrzucić. 

00:08:03,964 --> 00:08:05,624 [Speaker 1]
Fajne, podoba mi się to. Kurde. 

00:08:05,624 --> 00:08:06,004 [Speaker 0]
Tak. 

00:08:06,004 --> 00:08:06,984 [Speaker 1]
Tak. 

00:08:06,984 --> 00:08:16,524 [Speaker 0]
Czyli że człowiek jeszcze ma okazję w razie czego zaingerować, żeby nie było, że wyda za coś dziesięć koła, a to będzie scam na przykład. Czyli musimy chronić się jeszcze przed scamem. 

00:08:20,104 --> 00:08:20,624 [Speaker 0]
Coś jeszcze? 

00:08:22,164 --> 00:08:23,404 [Speaker 0]
Czy na razie zatrzymać? 

00:08:26,284 --> 00:08:27,124 [Speaker 1]
Może to są jeszcze00:00:00,300 --> 00:00:18,540 [Speaker 0]
To, że też może być na przykład takie zaznaczenie, że na przykład jeżeli to będzie Amazon, no to jest spokojnie, bo to jest pewne, ale jeżeli to będzie strona typu Janusz kropka com, to może być taka gwiazdka, że, yy, taki-- to, bo to może być typu critical error, co nie? Że możesz zostać oszukany i wtedy powiadomienie, które człowiek musi odpowiedzieć, co nie? 

00:00:18,540 --> 00:00:53,820 [Speaker 1]
Tak. Super. I to jest to, co mówisz jest super. Bo tak czasami zdarza się, że są strony, które są sca-scammerskie i nie chcemy z takich stron korzystać, przez co człowiek musi prowadzić zawsze, yy, taki, yy, być przy tym i widzieć, jeśli nasz agent będzie chciał z takiej scammerskiej strony skorzystać, co jest bardzo istotne. Jest lista na pewno gdzieś na internecie, rankingi różnych zaufanych stron, gdzie możesz coś kupić. Chcielibyśmy, żeby te rankingi były również wypisane w naszym rozwiązaniu, żeby była zebrana grupa, do której możemy dodawać w ogóle sami z siebie ulubione strony. 

00:00:53,820 --> 00:00:54,660 [Speaker 0]
Tak. 

00:00:54,660 --> 00:00:54,920 [Speaker 1]
Tak? 

00:00:54,920 --> 00:00:56,480 [Speaker 0]
O kurwa, ej! 

00:00:56,480 --> 00:01:08,520 [Speaker 1]
Dodajemy ulubione strony. Mało tego, yy, co jeszcze możemy dodać? Ulubione strony nawet możemy dodać na etapie wyszukiwania produktu czy, czy, czy coś takiego na podstawie rozmowy. Yy, 

00:01:09,800 --> 00:01:15,260 [Speaker 1]
bo czasami oczywiście pewne grupy społeczne kupują produkty, które- 

00:01:15,260 --> 00:01:16,500 [Speaker 0]
Dobra w chuj, podoba mi się 

00:01:16,500 --> 00:01:32,960 [Speaker 1]
... które na przykład śrubki nie s-- ciężko znaleźć na Amazonie, ale są u jakiejś tam innej strony. I to, to też trzeba badać tą zaufaność tych stron. I dlatego każdy musi mieć takie ulubione strony. I dodatkowo te strony musisz jakby badać na podstawie profilu użytkownika. 

00:01:32,960 --> 00:01:42,960 [Speaker 0]
No tak i zapisywać w tej personie. Tak. Typu na przykład człowiek może uznać, że jego preferowaną stroną jest Allegro, nawet jeżeli to jest droższe niż, yy, załóżmy tam kurwa, 

00:01:44,080 --> 00:01:55,470 [Speaker 0]
nie wiem, x com, to i tak on woli z Allegro korzystać, bo takie są jego preferencje. Czyli po prostu wtedy w procesie tych agentów, jak mamy pięć agentów, które myślą, to po prostu waga na stronę, yy, się po prostu zwiększa. 

00:01:55,470 --> 00:01:55,480 [Speaker 1]
Tak. 

00:01:55,480 --> 00:01:56,680 [Speaker 0]
Bo tak człowiek wybrał. 

00:01:56,680 --> 00:02:30,640 [Speaker 1]
Mało tego, jeśli na przykład mamy opcję, że człowiek mówi, że on chce jednak mieć jakiś udział w tym zakupie, czyli na przykład chce sprawdzić końcowy zakup, no to my dajemy możliwość, żeby on sam stwierdził, na przykład powie, że Amazon jest jego ulubioną stroną, natomiast jakaś inna Janusz kropka x będzie miała tańszy produkt. Ale też ta strona jest w miarę zaufana i chcemy go o tym poinformować. Czy bardziej ci zależy na tym, czy na tym? Żeby to był taki proces, w którym człowiek czuł się dobrze. A my te wszystkie informacje musimy oczywiście później zachowywać, całe te konteksty- 

00:02:30,640 --> 00:02:30,780 [Speaker 0]
No 

00:02:30,780 --> 00:02:44,480 [Speaker 1]
... embeddingami jakoś dobierać, stworzyć z tego cały jakby sieć, taką knowledge, żebyśmy po prostu później wiedzieli, jak działa nasz użytkownik, żebyśmy jeszcze bardziej byli z nim dopasowani do niego. Czyli takie systemy zaawansowane rekomendacji. 

00:02:45,780 --> 00:02:48,840 [Speaker 0]
Okej, dobra, ale podoba mi się w chuj z tymi ulubionymi stronami. 

00:02:49,920 --> 00:03:03,920 [Speaker 0]
Yy, właśnie kwestia człowiek może sobie wybrać ulubione strony. Jest zapisywane. Ale właśnie druga też sprawa przy discover czy discover decide, yy, to agent wyszukuje właśnie rankingi rzetelności tych stron. 

00:03:03,920 --> 00:03:04,120 [Speaker 1]
Tak. 

00:03:04,120 --> 00:03:18,240 [Speaker 0]
Sprawdza i jeżeli coś jest scammerskie, yy, znaczy coś śmierdzi scammersco, to na przykład właśnie wysłać powiadomienie, na które trzeba odpowiedzieć. Człowiek musi na to odpowiedzieć, czy mu się godzi, yy, no to. 

00:03:18,240 --> 00:03:24,740 [Speaker 1]
Tak fajnie. Czyli musimy badać również strony i to w kwestii już discovery, gdzie mamy już takie security nasze. 

00:03:24,740 --> 00:03:27,340 [Speaker 0]
Właśnie, właśnie to jest całe wiesz. 

00:03:27,340 --> 00:03:29,260 [Speaker 1]
To są bardzo ważne rzeczy. 

00:03:29,260 --> 00:03:30,850 [Speaker 0]
Fajne. Kurde, ej. 

00:03:30,850 --> 00:03:31,560 [Speaker 1]
No. 

00:03:31,560 --> 00:03:32,609 [Speaker 0]
Stary nie, podoba mi się w chuj no. 

00:03:32,609 --> 00:03:33,780 [Speaker 1]
Podoba mi się też no. 

00:03:35,700 --> 00:03:36,040 [Speaker 1]
Dobra. 

00:03:37,400 --> 00:03:57,410 [Speaker 1]
Ogólnie zależy nam jeszcze w całym naszym rozwiązaniu, zależy na tym, żeby to było jak najbardziej też emocjonalne, czyli bardzo wchodziło w u-- takiego użytkownika. Czyli żebyśmy rozumieli jego potrzeby, rozumieli jego personalia, rozumieli jego emocje, rozumieli w ogóle, jak działa rynek. To, to są bardzo ważne im-- informacje dla nas, żebyśmy jak najbardziej byli takim zaufanym przyjacielem człowieka. 

00:03:57,410 --> 00:03:59,300 [Speaker 0]
Aby człowiek się czuł się zaopiekowany. 

00:03:59,300 --> 00:04:17,579 [Speaker 1]
Tak. I czuł, że każdy rozumie, niezależnie od grupy społecznej czy wieku na przykład. Ponieważ, yy, chłopak lat dwadzieścia będzie inne produkty szukał niż kobieta siedemdziesiąt sześć lat. Ale chcemy tej kobiecie tak uprosić ten proces, żeby ona nie musiała się martwić, że coś jest niezrozumiałego w tym. 

00:04:19,140 --> 00:04:20,840 [Speaker 0]
Mhm. 

00:04:20,840 --> 00:04:21,820 [Speaker 1]
Tak. 

00:04:21,820 --> 00:04:23,280 [Speaker 0]
Okej. 

00:04:23,280 --> 00:04:54,900 [Speaker 1]
No i ogólnie musimy też wymyśleć, w jaki sposób chcemy uzyskiwać te notyfikacje, powiadomienia, informację zwrotną od naszego, od naszych agentów, gdzie trzeba coś zatwierdzić. Czy chcemy to przez, poprzez rozmowę telefoniczną? Możemy zrobić kilka opcji nawet. Sobie każdy wymyśla. Czy po-powiadomienie, push ups. Bo obstawiam, że na przykład osoby starsze wolałyby telefoniczną, bo one są dużo bardziej rozumieją techno-- tech-- rozmowę. Natomiast młode osoby pewnie wolałyby WhatsApp, by tylko pyk, pyk. Albo jakąś apkę do tego zrobić. Musimy też to przemyśleć. 

00:04:57,380 --> 00:04:58,200 [Speaker 1]
Dobra, co dalej? 

00:04:59,260 --> 00:05:00,560 [Speaker 1]
Dalej jest jeszcze track. 

00:05:00,560 --> 00:05:02,260 [Speaker 0]
Track i rezo-resolve. 

00:05:02,260 --> 00:05:03,599 [Speaker 1]
Może zatrzymam go. 

00:05:03,600 --> 00:05:03,740 [Speaker 0]
No.00:00:01,260 --> 00:00:04,159 [Speaker 0]
Dobra, teraz przechodzimy do kolejnego etapu, czyli track. 

00:00:04,160 --> 00:00:27,620 [Speaker 1]
Track. Tak generalnie to, co jest istotne w tracku, to tak, żebyśmy mieli wizualizację, prosty dashboard do zobaczenia w jaki sposób-- znaczy ile, ile paczka leci, gdzie, gdzie się dostanie, na jakim jest etapie. Czyli generalnie ja to widzę w taki sposób, jak po prostu w aplikacji InPostu masz wszystko pokazane. Wiesz dokładnie, kiedy co będzie. Później dostajesz informację odnośnie odbioru. Yy, 

00:00:28,680 --> 00:00:41,880 [Speaker 1]
tak naj-najprościej to zrobić. Problemy jakie tutaj widzę to integracja z, yy, z dostawcami, co nie? Yy, jak to może wyglądać? Na przykład wiecie, czasem może być DPD, 

00:00:42,940 --> 00:00:50,260 [Speaker 1]
DHL, kurde, Amazon, paczka czy coś. To może być problematyczne. W najgorszym wypadku po prostu można 

00:00:51,280 --> 00:00:53,020 [Speaker 1]
dać przekierowanie, 

00:00:54,140 --> 00:00:54,640 [Speaker 1]
yy, 

00:00:55,780 --> 00:01:04,730 [Speaker 1]
do jakiejś zewnętrznej strony, nie? Ale w sumie tutaj się zastanawiam, yy, czy kupujesz? Nie, bo jak kupuję na przykład na Allegro to nie muszę mieć konta, 

00:01:05,990 --> 00:01:06,640 [Speaker 1]
yy, InPosta. 

00:01:08,860 --> 00:01:20,780 [Speaker 2]
Nie, Allegro samo jakby queryuje InPosta, odbierze od niego ten sześciocyfrowy kod do odbioru paczki. Kod QR zbiera, yy, i jakby wyświetlasz to sobie w Allegro, tak? 

00:01:20,780 --> 00:01:22,339 [Speaker 1]
Okej, no dobra, to jest spoko, spoko. 

00:01:23,840 --> 00:01:29,100 [Speaker 1]
No dobra, to dosłownie kopia InPostu żeby to wyglądało. Nie trzeba będzie zrobić więcej kont. 

00:01:31,580 --> 00:01:36,240 [Speaker 1]
Mo-może czegoś nie widzę, ale nie wydaje się to jakoś turbo complicated. 

00:01:37,700 --> 00:01:40,500 [Speaker 0]
Nie ma co więcej dodać. Co ostatnie jest? 

00:01:40,500 --> 00:01:40,960 [Speaker 1]
Resolve. 

00:01:42,600 --> 00:01:45,790 [Speaker 1]
Resolve no to tak naprawdę po prostu potwierdzenie, yy, 

00:01:47,740 --> 00:01:48,780 [Speaker 1]
czy zamknięcie, 

00:01:50,740 --> 00:02:03,300 [Speaker 1]
yy, procesu. Ewentualnie ja też widzę, bo w resolve zawsze warto dopytać. W sensie, że może być właśnie notyfikacja, że jest odbiór i ewentualnie właśnie może być dopytanie, ee, agenta, 

00:02:05,070 --> 00:02:11,820 [Speaker 1]
yy, że agent pyta człowieka, że jakby ten proces czy się podobało, czy coś zmienić, żeby na przyszłość po prostu wiedział. Wiecie, po prostu taki feedback do- 

00:02:11,820 --> 00:02:12,860 [Speaker 0]
Tak. 

00:02:12,860 --> 00:02:13,520 [Speaker 1]
Agenta. 

00:02:13,520 --> 00:02:26,420 [Speaker 0]
Czyli wszelkiego rodzaju opinie, zbieranie opinii. 

00:02:29,500 --> 00:02:30,820 [Speaker 1]
Trzynasta dzisiaj dwadzieścia. 

00:02:33,140 --> 00:02:35,500 [Speaker 1]
Kurde, yy. 

00:02:39,060 --> 00:02:40,300 [Speaker 2]
Co jeszcze widzicie? Resolve. 

00:02:41,900 --> 00:02:42,900 [Speaker 1]
Co do zamknięcia. 

00:02:46,820 --> 00:02:47,720 [Speaker 0]
Chyba tyle, co nie? 

00:02:47,720 --> 00:03:01,940 [Speaker 1]
Może nie wiem. Myślę, może być nawet, yy. Nie wiem, czy to jest istotne, ale dobra, podzielę się. Może nawet taka informacja, że dzięki użyciu, yy, tam naszego Zip Zap Solved zaoszczędziłeś, yy, ileś tam minut czasu. 

00:03:01,940 --> 00:03:03,260 [Speaker 0]
O! Super. 

00:03:03,260 --> 00:03:03,860 [Speaker 1]
Żebyśmy- 

00:03:03,860 --> 00:03:07,340 [Speaker 0]
Czyli liczymy ślad węglowy. 

00:03:07,340 --> 00:03:08,660 [Speaker 1]
Znaczy nie żeby ślad węglowy- 

00:03:08,660 --> 00:03:14,299 [Speaker 2]
Zaoszczędziłeś piętnaście minut, a zużyłeś pół tony dwutlenku węgla. 

00:03:14,300 --> 00:03:23,820 [Speaker 0]
Nie no, ale trzeba zbierać informacje o tym po prostu, ile czasu zaoszczędziliśmy. Zbierać jakiś feedback, potwierdzać, że paczka została odebrana, że jesteś zadowolony z korzystania. 

00:03:25,580 --> 00:03:29,640 [Speaker 0]
Może dodawać coś do ulubionych. Może coś w ten deseń. Na tym jeszcze bazować. 

00:03:31,280 --> 00:03:31,560 [Speaker 1]
Dobra. 

00:03:34,640 --> 00:03:38,000 [Speaker 1]
Dobra, tutaj ja to wysyłam Aleksandrowi. Przygotuj link00:00:00,080 --> 00:00:00,680 [Speaker 0]
Dodatek to co- 

00:00:00,680 --> 00:00:10,780 [Speaker 1]
Dobra, Siemano. Mamy teraz dodatek dla Ciebie. Chcielibyśmy, żebyś wziął pod uwagę nasze, yy, wszystkie takie informacje i później żebyś to zaimplementował do naszych ogólnych transkrypcji, które podawaliśmy Ci wcześniej. 

00:00:12,040 --> 00:00:16,720 [Speaker 1]
To są nasze przemyślenia i to, co dodatkowo byśmy chcieli w naszym całym rozwiązaniu. Let's go. 

00:00:16,720 --> 00:00:43,150 [Speaker 0]
Tak. To, co na pewno chciałbym dodać, to co jest bardzo istotne, yy, że dotychczas myśleśmy o zakupie jednego produktu naraz, a bardzo też, yy, może być przydatne dla ludzi, yy, zrealizowanie jakiejś listy zakupów albo nawet przepisu typu: pani babcia chce zrobić sernik, jest przepis na sernik i ona podaje to. No i nasz agent jest w stanie zakupić wszystkie potrzebne składniki, yy, tak żeby nie trzeba było po prostu tego rozbijać. To jest- 

00:00:43,150 --> 00:00:43,160 [Speaker 1]
Super. 

00:00:43,160 --> 00:00:43,840 [Speaker 0]
To jest bardzo- 

00:00:43,840 --> 00:00:44,940 [Speaker 1]
To jest super. 

00:00:44,940 --> 00:00:49,440 [Speaker 0]
To jest, to jest super. Że, że to musi być. Yy, myślę, że też na prezentacji to trzeba pokazać. 

00:00:49,440 --> 00:00:51,300 [Speaker 1]
To jako jeden z case'ów pokażemy. 

00:00:51,300 --> 00:01:05,460 [Speaker 0]
Tak. I-i do tego też, yy, istotne będzie na przykład w dostawie, yy, pokazanie, że jak, yy, załóżmy, ku-kupowałoby się niektóre rzeczy oddzielnie, to by było jakoś tam drożej, ale jak weźmiemy- 

00:01:05,460 --> 00:01:06,520 [Speaker 1]
Od jednego sprzedawcy. 

00:01:06,520 --> 00:01:15,240 [Speaker 0]
To będzie-- może, może cena będzie tam nieco wyższa, ale przez to, że dostawa będzie tańsza, to sumarycznie, yy, całość będzie tańsza, więc to też warto- 

00:01:15,240 --> 00:01:17,420 [Speaker 1]
Musimy to wziąć pod uwagę w uwagach. 

00:01:17,420 --> 00:01:39,920 [Speaker 0]
Tak, tak pod uwagę w uwagach podczas procesu discovery. Yy, i dodatkowo też, yy, tak na koniec warto, żeby była opcja dla użytkownika pokazania w jakiś sposób ładny chain of thoughts naszego agenta. Yy, czyli żebyśmy się dowiedzieli, dlaczego na przykład wybrał taki produkt, a nie inny, yy, i na jakiej podstawie. Żeby to było też explainable AI, yy, co też jest bardzo ważne. 

00:01:42,240 --> 00:01:44,220 [Speaker 0]
Ja-ja-jakie, jakie macie jeszcze rzeczy? 

00:01:44,220 --> 00:02:09,740 [Speaker 1]
Yy, do tego powinniśmy dodać tutaj też te constrainty dla AI-a. W sensie czy możemy kupo-- czy agent może kupić w ciemno cokolwiek poniżej ustalonej kwoty, yy, a jeżeli przekraczamy do dwudziestu procent czy cokolwiek, to ma zapytać użytkownika. W sensie to też powinno być jakoś tam dopytane, yy, żeby mu potem nie zawracać, yy, nie zawracać głowy. Yy, 

00:02:11,560 --> 00:02:12,840 [Speaker 1]
chyba tyle. 

00:02:14,100 --> 00:02:19,220 [Speaker 1]
No tak, żeby generalnie ten poziom autonomii agenta wyspecyfikować. 

00:02:19,220 --> 00:02:20,060 [Speaker 0]
Tak. 

00:02:20,060 --> 00:02:54,440 [Speaker 2]
I musimy jeszcze przemyśleć, w jaki sposób chcemy, żeby kontaktowało to się z użytkownikiem. Czy przez rozmowę telefoniczną z naszej aplikacji, czy poprzez, yy, znaczy to jest rozmowa audio w naszej aplikacji, czy poprzez push na WhatsAppie, czy żeby już użytkownik mógł sobie wybrać. Dodatkowo chcemy, żeby móc zautomatyzować część ulubionych sklepów, ponieważ czasami pojawiają się na stronie CAPTCHA i te inne rzeczy i tego nie możemy rozwiązać. Agent jest blokowany. Natomiast chcielibyśmy, żeby gdzie się da, to chcielibyśmy mieć już gotowy pipeline i dodatkowo chcielibyśmy, żeby... 

00:02:56,720 --> 00:02:57,280 [Speaker 2]
Nie pamiętam. 

00:02:58,900 --> 00:02:59,300 [Speaker 2]
Dobra. 

00:03:00,740 --> 00:03:11,040 [Speaker 0]
Mhm. Dobra, no mamy jeszcze, możemy dorzucać w trakcie, co nie? Po prostu ważne, żeby, żeby to, co mamy teraz. Mamy poprzednie zapiski. Yy, o tak. 

00:03:12,140 --> 00:03:12,820 [Speaker 0]
Mamy poprzednie zapiski