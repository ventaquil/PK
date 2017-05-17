# Projekt z przedmiotu **Protokoły Kryptograficzne**

## Instalacja
Aby pobrać niezbędne komponenty należy wywołać

    npm install

Następnie gdy wszystko się ściągnie uruchamiamy budowanie plików skryptów oraz styli

    gulp

## Śledzenie zmian

W trakcie wprowadzania zmian możemy uruchomić `gulp watch` aby skrypty oraz style były budowane na bieżąco.

## Uruchamianie

W celu uruchomienia aplikacji zaleca się wcześniejsze uruchomienie MongoDB, po czym wywołanie

    node application.js

###### Opcjonalne zmienne środowiskowe

- **PORT** - podanie numeru portu aplikacji
- **MONGODB_PORT** - podanie numeru portu MongoDB
- **MONGODB_DATABASE** - podanie nazwy bazy MongoDB

## Tworzenie i praca z gałęźmi

Kilka prostych zasad jak to prawidłowo robić:

* gałąź `master` zawiera najnowszą wersję stabilną
* wszystkie gałęzie robocze wychodzą z gałęzi _wersji_ do której chcemy wprowadzić zmiany
* przy rozpoczynaniu pracy nad jakimś _issue_ naszą gałąź roboczą nazywamy `issue/NR` gdzie `NR` to numer naszego _issue_
* w _issue_ zamieszczamy krótki opis zmian jakie zamierzamy wprowadzić
* po zakończeniu prac zamieszczamy w _issue_ komentarz z podsumowaniem i przekazujemy do przejrzenia
* po akceptacji naszą gałąź wpinamy do niezamkniętej gałęzi aktualizacji _wersji_ w której wprowadzaliśmy poprawki
* gałąź nowej _wersji_ wychodzi bezpośrednio z gałęzi _wersji_ poprzedniej
* nazewnicstwo gałęzi _wersji_ jest następujące: `release/vX.Y.Z` gdzie `X.Y.Z` to wersja według [wersjonowania semantycznego](http://semver.org/)
* po zamknięciu _wersji_ jej gałąź wgrywamy do `master`
