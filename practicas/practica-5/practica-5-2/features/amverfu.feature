# language: es

Feature: Consulta de información de Pokémon en AMVERFU
  Como usuario del Explorador Pokémon
  Quiero buscar Pokémon mediante su nombre
  Para consultar su información y recibir una respuesta adecuada

  # -------------------------------
  # ESCENARIO 1 - BÚSQUEDA EXITOSA|
  # -------------------------------

  Scenario: Buscar un Pokémon existente
    Given que el usuario se encuentra en el Explorador Pokémon
    When introduce "pikachu" y realiza la búsqueda
    Then el sistema debe mostrar la información de Pikachu


  # --------------------------------------
  # ESCENARIO 2 - INFORMACIÓN DEL POKÉMON|
  # --------------------------------------

  Scenario: Mostrar información de Pikachu
    Given que el usuario se encuentra en el Explorador Pokémon
    When introduce "pikachu" y realiza la búsqueda
    Then el sistema debe mostrar el nombre, ID, altura y peso de Pikachu


  # --------------------------------------
  # ESCENARIO 3 - BÚSQUEDA CON MAYÚSCULAS|
  # --------------------------------------

  Scenario: Buscar un Pokémon utilizando mayúsculas
    Given que el usuario se encuentra en el Explorador Pokémon
    When introduce "PIKACHU" y realiza la búsqueda
    Then el sistema debe mostrar la información de Pikachu


  # ----------------------------------
  # ESCENARIO 4 - POKÉMON INEXISTENTE|
  # ----------------------------------

  Scenario: Buscar un Pokémon que no existe
    Given que el usuario se encuentra en el Explorador Pokémon
    When introduce "jose" y realiza la búsqueda
    Then el sistema debe mostrar "No se encontró el Pokémon jose."


  # --------------------------
  # ESCENARIO 5 - CAMPO VACÍO|
  # --------------------------

  Scenario: Intentar realizar una búsqueda sin introducir un nombre
    Given que el usuario se encuentra en el Explorador Pokémon
    When intenta realizar la búsqueda sin introducir un nombre
    Then el sistema debe impedir el envío del formulario
    And debe solicitar que se complete el campo del nombre del Pokémon