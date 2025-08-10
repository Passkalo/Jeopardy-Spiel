# Jeopardy Spiel

Dies ist ein webbasiertes Jeopardy-Spiel, das Sie anpassen und direkt im Browser spielen können. Es wurde mit HTML, CSS (unter Verwendung von Tailwind CSS) und JavaScript entwickelt.

## Funktionen

-   **Anpassbares Spielbrett**: Erstellen Sie Ihre eigenen Kategorien, Fragen und Punktwerte.
-   **Teamverwaltung**: Fügen Sie Teams hinzu, benennen Sie sie um und behalten Sie den Überblick über die Punktstände.
-   **Anpassbare Gestaltung**: Ändern Sie den Spieltitel, die Hauptfarbe und fügen Sie ein eigenes Logo mit anpassbarer Position und Größe hinzu.
-   **Speicherfunktion**: Ihre Spielkonfiguration und die aktuellen Punktstände werden automatisch im lokalen Speicher Ihres Browsers gesichert, sodass sie auch nach dem Neuladen der Seite erhalten bleiben.
-   **Import/Export**: Speichern und laden Sie Ihre Spielkonfiguration als JSON-Datei, um sie einfach zu sichern oder mit anderen zu teilen.
-   **Responsives Design**: Die Benutzeroberfläche ist so gestaltet, dass sie auf verschiedenen Bildschirmgrößen gut aussieht und funktioniert.

## Anleitung zur Benutzung

### 1. Einrichtungsphase

Wenn Sie die Datei `index.html` öffnen, sehen Sie zuerst den Einrichtungsbildschirm.

-   **UI-Einstellungen**:
    -   **Spieltitel**: Geben Sie einen Titel für Ihr Spiel ein.
    -   **Logo-URL**: Fügen Sie die URL eines Logos ein. Dieses wird auf dem Spielbrett angezeigt.
    -   **Logo-Einstellungen**: In diesem ausklappbaren Bereich können Sie die Sichtbarkeit, Position und Größe des Logos anpassen.
    -   **Hauptfarbe**: Wählen Sie eine Farbe, die für die wichtigsten UI-Elemente (Überschriften, Buttons, Titel) verwendet wird.

-   **Teams**:
    -   Benennen Sie die Standardteams um oder fügen Sie neue Teams hinzu, indem Sie auf **"Team hinzufügen"** klicken.

-   **Kategorien & Fragen**:
    -   Klicken Sie auf **"Neue Kategorie hinzufügen"**, um eine neue Kategorie zu erstellen.
    -   Für jede Kategorie können Sie den Namen ändern, Fragen hinzufügen und die entsprechenden Punktwerte, die Frage und die Antwort festlegen.

-   **Speichern & Laden**:
    -   Mit **"Konfiguration speichern"** können Sie die gesamte Spielkonfiguration als `jeopardy-config.json` Datei herunterladen.
    -   Mit **"Konfiguration laden"** können Sie eine zuvor gespeicherte JSON-Datei importieren.

-   **Spielstart**:
    -   Wenn Sie mit der Einrichtung zufrieden sind, klicken Sie auf **"Spiel starten"**.

### 2. Spielphase

-   Auf dem Spielbrett werden alle Kategorien und Punktwerte angezeigt.
-   Klicken Sie auf eine Punktzahl, um die Frage in einem Pop-up-Fenster zu öffnen.
-   Klicken Sie auf **"Antwort anzeigen"**, um die richtige Antwort zu enthüllen.
-   Vergeben Sie Punkte an ein Team, indem Sie auf den entsprechenden Button klicken.
-   Bereits gespielte Fragen sind ausgegraut und können nicht erneut ausgewählt werden.
-   Die Punktstände der Teams werden am unteren Rand des Bildschirms angezeigt und in Echtzeit aktualisiert.
-   Mit **"Einstellungen bearbeiten"** kehren Sie jederzeit zum Einrichtungsbildschirm zurück.

### 3. Zurücksetzen

-   Auf dem Einrichtungsbildschirm setzt die Schaltfläche **"Auf Standardwerte zurücksetzen"** alle benutzerdefinierten Daten (Teams, Kategorien, Fragen, Branding) zurück und stellt die ursprünglichen Standardwerte wieder her.

## Verwendete Technologien

-   **HTML5**
-   **CSS3**
-   **Tailwind CSS**: Ein Utility-First-CSS-Framework für schnelle UI-Entwicklung.
-   **JavaScript (ES6+)**