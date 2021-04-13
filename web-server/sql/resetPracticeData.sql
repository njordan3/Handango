DELETE FROM dragdrop WHERE id > 0;
ALTER TABLE dragdrop AUTO_INCREMENT=1;

INSERT INTO dragdrop (id, phrases) VALUES
	(DEFAULT, '{"type": "DragDrop", "phrases": ["F", "Q", "R"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["T", "X", "W"]}'), 
	(DEFAULT, '{"type": "DragDrop", "phrases": ["S", "L", "P"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["B", "A", "N"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["K", "Y", "M"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["P", "Z", "C"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["V", "I", "U"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["J", "S", "T"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["E", "O", "G"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["N", "Q", "F"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["Z", "F", "B"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["L", "J", "R"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["E", "P", "M"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["A", "X", "L"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["N", "B", "V"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["I", "O", "T"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["Y", "H", "F"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["G", "K", "L"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["P", "W", "R"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["E", "A", "S"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["D", "F", "G"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["H", "J", "V"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["O", "I", "Z"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["D", "Y", "P"]}'),
	(DEFAULT, '{"type": "DragDrop", "phrases": ["L", "S", "M"]}');
    
DELETE FROM fingerspelling WHERE id > 0;
ALTER TABLE fingerspelling AUTO_INCREMENT=1;

INSERT INTO fingerspelling (id, phrases) VALUES
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["ga", "jack", "mcgregor"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["columbia", "ca", "adidas"]}'), 
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["nc", "harry", "costco"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["nick", "oh", "montgomery"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["nike", "cincinnati", "al"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["seattle", "fl", "george"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["az", "coke", "jacksonville"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["thomas", "edward", "speedo"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["ut", "prescott", "lexus"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["beth", "al", "toyota"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["bakersfield", "tony", "ak"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["az", "lexus", "karen"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["anthony", "ar", "ibm"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["ca", "ferrari", "jason"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["co", "gina", "amazon"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["apple", "gabby", "ct"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["neiman", "google", "de"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["microsoft", "fl", "jean"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["ga", "juan", "visa"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["id", "facebook", "larry"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["moe", "verizon", "il"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["in", "harold", "disney"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["larson", "ia", "bobby"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["ks", "starbucks", "jordan"]}'),
	(DEFAULT, '{"type": "FingerSpelling", "phrases": ["ford", "james", "hi"]}');
    
DELETE FROM fingerspellinginterp WHERE id > 0;
ALTER TABLE fingerspellinginterp AUTO_INCREMENT=1;
    
INSERT INTO fingerspellinginterp (id, phrases) VALUES
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["co", "devin", "harold"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["blistex", "ri", "memphis"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["justin", "corsair", "vt"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["mo", "ks", "boise"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["aston", "razer", "wy"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["tx", "richard", "sandpoint"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["spokane", "aidan", "wa"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["elijah", "bakersfield", "casio"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["daniel", "chattanooga", "sd"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["in", "paypal", "donald"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["walmart", "ia", "ronald"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["smith", "samsung", "ks"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["intel", "ky", "william"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["stacy", "la", "bmw"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["oracle", "me", "chad"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["shannon", "youtube", "md"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["ma", "reddit", "tyler"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["ferris", "mi", "twitter"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["alex", "snapchat", "ri"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["ashley", "pa", "instagram"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["robert", "cisco", "ok"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["boston", "or", "netflix"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["wyatt", "hulu", "nm"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["kenneth", "nv", "chase"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterp", "phrases": ["ny", "johnpaul", "subway"]}');
    
DELETE FROM dragdropnumbers WHERE id > 0;
ALTER TABLE dragdropnumbers AUTO_INCREMENT=1;
    
INSERT INTO dragdropnumbers (id, phrases) VALUES
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["8", "77", "643"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["12", "5", "8509"]}'), 
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["400", "0", "12537"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["963", "44", "3544"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["56", "3", "690"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["13", "712", "8200"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["9", "566", "7876"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["4637", "8", "49"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["15689", "906", "10"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["54", "2", "336"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["45", "1", "53"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["3", "32", "85"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["94", "4", "51"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["53", "5", "62"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["42", "57", "6"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["78", "7", "955"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["1000", "74", "8"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["953", "9", "620"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["85", "0", "88"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["1", "21", "10"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["11", "8", "12"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["13", "14", "4"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["12", "5", "60"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["2", "12", "30"]}'),
	(DEFAULT, '{"type": "DragDropNumbers", "phrases": ["1732", "15", "7"]}');
    
DELETE FROM fingerspellingnumbers WHERE id > 0;
ALTER TABLE fingerspellingnumbers AUTO_INCREMENT=1;
    
INSERT INTO fingerspellingnumbers (id, phrases) VALUES
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["912", "46", "6"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["423", "5444", "82"]}'), 
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["77", "16", "506"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["24", "1", "870"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["55", "18", "451"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["8655", "12405", "4"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["21", "706", "809"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["533", "2", "777"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["9379", "887", "982"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["1", "32", "24"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["326", "2", "35"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["75", "63", "3"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["43", "4", "85"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["5", "96", "54"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["14", "6", "85"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["69", "24", "7"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["8", "26", "75"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["59", "9", "36"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["2", "96", "24"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["58", "3", "36"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["4", "33", "56"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["91", "5", "22"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["52", "12", "1"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["6", "48", "42"]}'),
	(DEFAULT, '{"type": "FingerSpellingNumbers", "phrases": ["37", "34", "81"]}');
    
DELETE FROM fingerspellinginterpnumbers WHERE id > 0;
ALTER TABLE fingerspellinginterpnumbers AUTO_INCREMENT=1;
    
INSERT INTO fingerspellinginterpnumbers (id, phrases) VALUES
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["85", "66", "909"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["661", "6551", "16"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["23", "8", "8461"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["194538", "101", "7"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["27", "661", "267"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["377", "899", "3754"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["26", "1211", "18667"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["1898", "777", "9"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["75", "902", "793"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["1", "75", "21"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["52", "2", "11"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["31", "95", "3"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["132", "4", "1008"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["5", "1102", "9641"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["982", "6", "52"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["42", "459", "7"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["62", "8", "357"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["9", "32", "95"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["61", "1", "93"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["35", "43", "2"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["315", "3", "498"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["4", "328", "64"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["647", "5", "8921"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["534", "293", "6"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpNumbers", "phrases": ["5677", "12", "364"]}');
    
DELETE FROM fingerspellinginterpquestions WHERE id > 0;
ALTER TABLE fingerspellinginterpquestions AUTO_INCREMENT=1;
    
INSERT INTO fingerspellinginterpquestions (id, phrases) VALUES
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["yes", "what", "name"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["work", "who", "house"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["learn", "mine", "interview"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["no", "when", "deaf"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["meet", "name", "city"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["house", "where", "your"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["why", "nice", "name"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["city", "what", "nicetomeetyou"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["what", "interview", "work"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["your", "house", "yes"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["deaf", "when", "learn"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["me", "meet", "mine"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["who", "city", "address"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["nice", "your", "why"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["deaf", "me", "nicetomeetyou"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["learn", "name", "what"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["where", "me", "what"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["nicetomeetyou", "interview", "learn"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["work", "address", "who"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["who", "no", "house"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["mine", "nice", "deaf"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["yes", "me", "city"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["meet", "why", "deaf"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["me", "what", "where"]}'),
	(DEFAULT, '{"type": "FingerSpellingInterpQuestions", "phrases": ["address", "your", "who"]}');
    
DELETE FROM dragdropquestions WHERE id > 0;
ALTER TABLE dragdropquestions AUTO_INCREMENT=1;
    
INSERT INTO dragdropquestions (id, phrases) VALUES
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["no", "house", "your"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["city", "address", "nice"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["deaf", "where", "nicetomeetyou"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["what", "me", "learn"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["who", "city", "house"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["deaf", "interview", "address"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["nice", "no", "what"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["work", "deaf", "mine"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["me", "who", "yes"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["where", "your", "meet"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["who", "deaf", "when"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["where", "when", "mine"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["nicetomeetyou", "mine", "city"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["mine", "what", "me"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["name", "who", "address"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["why", "nice", "where"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["interview", "work", "who"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["learn", "meet", "why"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["deaf", "me", "mine"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["house", "what", "name"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["what", "nicetomeetyou", "your"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["mine", "city", "deaf"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["yes", "address", "learn"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["me", "work", "interview"]}'),
	(DEFAULT, '{"type": "DragDropQuestions", "phrases": ["who", "no", "deaf"]}');
    
DELETE FROM selectquestions WHERE id > 0;
ALTER TABLE selectquestions AUTO_INCREMENT=1;
    
INSERT INTO selectquestions (id, phrases) VALUES
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "your", "choices": ["house", "nicetomeetyou", "your"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "me", "choices": ["yes", "me", "meet"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "name", "choices": ["your", "name", "what"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "where", "choices": ["deaf", "interview", "where"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "when", "choices": ["when", "learn", "who"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "what", "choices": ["nice", "when", "what"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "address", "choices": ["when", "address", "city"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "no", "choices": ["why", "no", "house"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "mine", "choices": ["what", "meet", "mine"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "who", "choices": ["nicetomeetyou", "who", "when"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "deaf", "choices": ["deaf", "work", "mine"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "learn", "choices": ["where", "learn", "me"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "city", "choices": ["who", "city", "where"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "interview", "choices": ["interview", "deaf", "nice"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "yes", "choices": ["when", "house", "yes"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "house", "choices": ["house", "when", "address"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "work", "choices": ["mine", "nicetomeetyou", "work"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "why", "choices": ["mine", "deaf", "why"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "deaf", "choices": ["no", "who", "deaf"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "name", "choices": ["me", "what", "name"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "learn", "choices": ["learn", "address", "who"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "what", "choices": ["what", "your", "house"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "meet", "choices": ["meet", "nice", "address"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "where", "choices": ["city", "where", "when"]}}'),
	(DEFAULT, '{"type": "SelectQuestions", "phrases": {"answer": "nicetomeetyou", "choices": ["nicetomeetyou", "why", "mine"]}}');
    
DELETE FROM multiplechoice WHERE id > 0;
ALTER TABLE multiplechoice AUTO_INCREMENT=1;
    
INSERT INTO multiplechoice (id, questions) VALUES
	(DEFAULT, '{"type": "MultipleChoice","phrases":[
			{"choices": ["15", "10", "18", "20"],
			"correct": 1,
			"question": "Fingerspelling only represents about __ percent of the languages overall elements."},
			{"choices": ["Fingerspelling is the letter representation of the entire alphabet",
				     "Fingerspelling is the representation of the entire alphabet and punctuation",
				     "Fingerspelling is the letter representation of the entire alphabet and 0 to 10",
				     "All of the above"],
			"correct": 0,
			"question": "What is fingerspelling?"},
			{"choices": ["True", "False"],
			"correct": 0,
			"question": "The use of fingerspelling is limited in ASL."}
	]}'),
	(DEFAULT, '{"type": "MultipleChoice","phrases":[
			{"choices": ["Proper names", "Names of towns, cities, and states", "Titles of books and movies", "Pronouns"],
			"correct": 3,
			"question": "What is fingerspelling NOT used for?"},
			{"choices": ["True", "False"],
			"correct": 1,
			"question": "You should use fingerspelling as your first choice when you don’t know a sign."},
			{"choices": ["True", "False"],
			"correct": 1,
			"question": "Fingerspelling is a substitute for signing"}
	]}'),
	(DEFAULT, '{"type": "MultipleChoice","phrases":[
			{"choices": ["Make sure your palm faces the receiver/reader", "Bounce the letters",
				     "Relax and let the letters flow smoothly", "Do not say or mouth single letters"],
			"correct": 1,
			"question": "What should you NOT do when fingerspelling?"},
			{"choices": ["Make sure your elbow is out from your body",
				     "Hold your dominant hand slightly to the right of your face and just below the cheek",
				     "Hold your dominant hand slightly to the right of your face and just below the chin",
				     "Dont slide slightly to the right for double letters"],
			"correct": 2,
			"question": "What should you do when fingerspelling?"},
			{"choices": ["True", "False"],
			"correct": 1,
			"question": "Speed is important"}
	]}'),
	(DEFAULT, '{"type": "MultipleChoice","phrases":[
			{"choices": ["Yes, all the time", "Never"],
			"correct": 0,
			"question": "Are abbreviations used in fingerspelling?"},
			{"choices": ["A sign that can be used in multiple contexts", "A shorthand version of a commonly used word",
				     "A sign that uses only the first and last letters of words", "A sign that borrows the first letter of words"],
			"correct": 1,
			"question": "What are loan signs?"},
			{"choices": ["A sign that is only fingerspelled", "An abbreviation",
				     "A sign that borrows the first letter of words", "A shorthand version of a commonly used word"],
			"correct": 2,
			"question": "What is an initialized sign?"}
	]}'),
	(DEFAULT, '{"type": "MultipleChoice","phrases":[
			{"choices": ["Make a fist with your dominant hand, make sure your thumb is on the side of the fist and not within it",
				     "Curl all fingers down and tuck the thumb into the palm",
				     "Make a fist. Tuck your thumb between your index and middle fingers",
				     "Make a fist, hold your pinky finger vertical"],
			"correct": 0,
			"question": "What sounds like the description for the letter A?"},
			{"choices": ["V", "P", "L", "H"],
			"correct": 3,
			"question": "What letter is represented by: Cross your index and middle fingers. Thumb, ring, and pinky fingers are tucked into palm?"},
			{"choices": ["Make a fist leaving your index finger vertical but bent into a hook shape",
				     "Make a fist. Tuck your thumb between your index and middle fingers",
				     "Place your index finger on top of your middle finger facing left, with your thumb tucked away behind the two fingers",
				     "Extend your thumb and index finger facing left, position hand facing slightly left. Middle, ring, and pinky fingers are tucked into palm"],
			"correct": 2,
			"question": "What sounds like the description for the letter H?"}
	]}'),
	(DEFAULT, '{"type": "MultipleChoice","phrases":[
			{"choices": ["Z", "M", "E", "N"],
			"correct": 3,
			"question": "What letter is represented by: Tuck your thumb into palm, then wrap your index and middle fingers over the thumb"},
			{"choices": ["All fingers are vertical and pressed together and your thumb is curled in to your palm",
				     "Pinch the index finger to the thumb. Middle, ring, and pinky fingers are vertical",
				     "Make a fist, place your thumb in front of your fingers",
				     "Tuck your thumb into palm, then wrap your index, middle, and ring fingers over the thumb"],
			"correct": 3,
			"question": "What sounds like the description for the letter M?"},
			{"choices": ["R", "Y", "O", "B"],
			"correct": 1,
			"question": "What letter is represented by: Extend your thumb and pinky finger. Tuck your index, middle, and ring fingers into your palm"}
	]}');
    
DELETE FROM multiplechoicenumbers WHERE id > 0;
ALTER TABLE multiplechoicenumbers AUTO_INCREMENT=1;
    
INSERT INTO multiplechoicenumbers (id, questions) VALUES
	(DEFAULT, '{"type": "MultipleChoiceNumbers","phrases":[
			{"choices": ["6", "2", "10", "9"],
			"correct": 1,
			"question": "Which number is formed the same way as the letter V?"},
			{"choices": ["middle", "index", "pinky", "thumb"],
			"correct": 2,
			"question": "Which finger represents the number 6?"},
			{"choices": ["11-15", "0-10", "16-19", "21-29"],
			"correct": 0,
			"question": "What range of numbers includes what are called Flicks?"}
	]}'),
	(DEFAULT, '{"type": "MultipleChoiceNumbers","phrases":[
			{"choices": ["11-15", "0-10", "16-19", "21-29"],
			"correct": 2,
			"question": "What range of numbers includes what are called Swing-outs?"},
			{"choices": ["6", "9", "2", "10"],
			"correct": 0,
			"question": "Which number is formed the same way as the letter W?"},
			{"choices": ["pinky", "thumb", "middle", "ring"],
			"correct": 3,
			"question": "Which finger represents the number 7?"}
	]}'),
	(DEFAULT, '{"type": "MultipleChoiceNumbers","phrases":[
			{"choices": ["6", "10", "2", "9"],
			"correct": 3,
			"question": "Which number is formed the same way as the letter F?"},
			{"choices": ["middle", "ring", "thumb", "index"],
			"correct": 0,
			"question": "Which finger represents the number 8?"},
			{"choices": ["Sign the numerator then slide right for the denominator", "Sign the numerator over the denominator",
				     "Sign the numerator then slide left for the denominator", "Sign the numerator first, then a slash with your hand, then the denominator last"],
			"correct": 1,
			"question": "How are fractions made?"}
	]}'),
	(DEFAULT, '{"type": "MultipleChoiceNumbers","phrases":[
			{"choices": ["ring", "thumb", "index", "middle"],
			"correct": 2,
			"question": "Which finger represents the number 9?"},
			{"choices": ["10", "20", "21", "30"],
			"correct": 1,
			"question": "Which number has a stand-alone sign?"},
			{"choices": ["Hundreds", "Tens", "Ones", "Thousands"],
			"correct": 0,
			"question": "What numbers use the letter C?"}
	]}'),
	(DEFAULT, '{"type": "MultipleChoiceNumbers","phrases":[
			{"choices": ["Hundreds", "Millions", "Thousands", "Tens"],
			"correct": 2,
			"question": "What numbers use the letter M once?"},
			{"choices": ["10", "2", "8", "9"],
			"correct": 0,
			"question": "Which number is formed in a similar way as the letter A?"},
			{"choices": ["Sign a dash with your hand", "Drop your hands and bring them up again", "The numbers dont need to be grouped", "Hesitate for a little bit"],
			"correct": 3,
			"question": "When signing a phone number, how should you group the different sets of numbers?"}
	]}'),
	(DEFAULT, '{"type": "MultipleChoiceNumbers","phrases":[
			{"choices": ["True", "False"],
			"correct": 1,
			"question": "There are no signs for numbers that are shared with signs for letters"},
			{"choices": ["Millions", "Thousands", "Tens", "Hundreds"],
			"correct": 0,
			"question": "What numbers use the letter M twice?"},
			{"choices": ["Simply go through fingerspelling as normal", "Hesitate between letters and numbers",
				     "Sign all letters with palm facing the reader and sign all numbers with palm facing you", "Flap your elbow out for numbers and bring your elbow in for letters"],
			"correct": 2,
			"question": "How should letters and numbers be used together?"}
	]}');
    
DELETE FROM multiplechoicequestions WHERE id > 0;
ALTER TABLE multiplechoicequestions AUTO_INCREMENT=1;
    
INSERT INTO multiplechoicequestions (id, questions) VALUES
	(DEFAULT, '{"type": "MultipleChoiceQuestions","phrases":[
			{"choices": ["True", "False"],
			"correct": 1,
			"question": "Facial expressions are not important when asking a question."},
			{"choices": ["True", "False"],
			"correct": 0,
			"question": "Interview question answers are presented in a simple ASL sign order."},
			{"choices": ["Raise your eyebrows to widen your eyes", "Tilt your head slightly forward",
				     "Nod your head", "Hold the last sign in your sentence"],
			"correct": 2,
			"question": "What should you NOT do when asking a yes-no question?"}
	]}'),
	(DEFAULT, '{"type": "MultipleChoiceQuestions","phrases":[
			{"choices": ["Hold your last sign", "Nod your head", "Make direct eye contact", "Tilt your head forward"],
			"correct": 1,
			"question": "What should you NOT do when asking a wh- word question?"},
			{"choices": ["eyes", "head", "torso", "legs"],
			"correct": 3,
			"question": "What body part is typically not used when asking a question?"},
			{"choices": ["True", "False"],
			"correct": 0,
			"question": "All wh- words have their own different variations."}
	]}'),
	(DEFAULT, '{"type": "MultipleChoiceQuestions","phrases":[
			{"choices": ["True", "False"],
			"correct": 0,
			"question": "When answering no, shake your head."},
			{"choices": ["True", "False"],
			"correct": 1,
			"question": "A question mark is never used when asking a question?"},
			{"choices": ["True", "False"],
			"correct": 1,
			"question": "Tone and emotion cannot be made clear without vocal intonation."}
	]}'),
	(DEFAULT, '{"type": "MultipleChoiceQuestions","phrases":[
			{"choices": ["True", "False"],
			"correct": 0,
			"question": "Facial expressions are equal to vocal intonation."},
			{"choices": ["True", "False"],
			"correct": 1,
			"question": "When signing the wh- words, use a nod."},
			{"choices": ["True", "False"],
			"correct": 0,
			"question": "Nonmanual behaviors do not use the hands."}
	]}'),
	(DEFAULT, '{"type": "MultipleChoiceQuestions","phrases":[
			{"choices": ["True", "False"],
			"correct": 0,
			"question": "When answering no, shake your head"},
			{"choices": ["True", "False"],
			"correct": 0,
			"question": "To sign Nice to meet you, combine Nice and Meet only."},
			{"choices": ["True", "False"],
			"correct": 0,
			"question": "Occasionally, a yes-no question is accompanied by a question mark."}
	]}'),
	(DEFAULT, '{"type": "MultipleChoiceQuestions","phrases":[
			{"choices": ["True", "False"],
			"correct": 0,
			"question": "I and Me have the same sign."},
			{"choices": ["True", "False"],
			"correct": 1,
			"question": "Rhetorical questions are not possible in sign language."},
			{"choices": ["True", "False"],
			"correct": 1,
			"question": "Only wh- word questions use facial expressions"}
	]}');
    
DELETE FROM webcam WHERE id > 0;
ALTER TABLE webcam AUTO_INCREMENT=1;

INSERT INTO webcam (id, phrase) VALUES
	(DEFAULT, '{"type": "WebCam", "phrase": ["A"]}'),
    (DEFAULT, '{"type": "WebCam", "phrase": ["B"]}'),
    (DEFAULT, '{"type": "WebCam", "phrase": ["C"]}'),
    (DEFAULT, '{"type": "WebCam", "phrase": ["D"]}'),
    (DEFAULT, '{"type": "WebCam", "phrase": ["E"]}'),
    (DEFAULT, '{"type": "WebCam", "phrase": ["F"]}');
    
DELETE FROM webcamnumbers WHERE id > 0;
ALTER TABLE webcamnumbers AUTO_INCREMENT=1;

INSERT INTO webcamnumbers (id, phrase) VALUES
	(DEFAULT, '{"type": "WebCamNumbers", "phrase": ["0"]}'),
	(DEFAULT, '{"type": "WebCamNumbers", "phrase": ["1"]}'),
    (DEFAULT, '{"type": "WebCamNumbers", "phrase": ["2"]}'),
    (DEFAULT, '{"type": "WebCamNumbers", "phrase": ["3"]}'),
    (DEFAULT, '{"type": "WebCamNumbers", "phrase": ["4"]}'),
    (DEFAULT, '{"type": "WebCamNumbers", "phrase": ["5"]}'),
    (DEFAULT, '{"type": "WebCamNumbers", "phrase": ["6"]}'),
    (DEFAULT, '{"type": "WebCamNumbers", "phrase": ["7"]}'),
    (DEFAULT, '{"type": "WebCamNumbers", "phrase": ["8"]}'),
    (DEFAULT, '{"type": "WebCamNumbers", "phrase": ["9"]}');
    
    
DELETE FROM webcamquestions WHERE id > 0;
ALTER TABLE webcamquestions AUTO_INCREMENT=1;

INSERT INTO webcamquestions (id, phrase) VALUES
	(DEFAULT, '{"type": "WebCamQuestions", "phrase": ["yes"]}'),
	(DEFAULT, '{"type": "WebCamQuestions", "phrase": ["no"]}'),
    (DEFAULT, '{"type": "WebCamQuestions", "phrase": ["meet"]}'),
    (DEFAULT, '{"type": "WebCamQuestions", "phrase": ["interview"]}'),
    (DEFAULT, '{"type": "WebCamQuestions", "phrase": ["house"]}'),
    (DEFAULT, '{"type": "WebCamQuestions", "phrase": ["address"]}');