// Primitives

// CHANGE ME PER DAY AND CALL makeInitial() to populate!
const baseUrl = "https://crudcrud.com/api/630f721a0b2449abb595eb3993b8c21a/AnimeForumPost";

function myPost( url, stuff ) {
    return $.ajax( {
        url: url,
        type: "POST", 
        dataType: "json",
        data: JSON.stringify( stuff ),
        contentType: "application/json"
    });
}

function myPut( url, stuff ) {
    return $.ajax( {
        url: url,
        type: "PUT",
        data: JSON.stringify( stuff ),
        contentType: "application/json"
    });
}

// Initial seed for rendering. Call me once endpoint is created, so we have some data to manipulate with the fort-end (data to help test front-end)

function makeInitial() {
    let post1 = new NewTopic( "I believe Steins:Gate is the best non-action Anime", new Date().toISOString().substring( 0,10 ) );
    let comment1 = new Comment( "I would agree but it may be to slow and dialogue based for some.", new Date().toISOString().substring( 0,10 ) );
    post1.push( comment1 );
    console.log( post1 );
    myPost( baseUrl, post1 )
    .then( ( resp ) => console.log( resp ) );
}

// Entity Layer

class NewTopic {
    constructor( name, date ){
        this.name = name;
        this.date = date;
        this.replies = 0;
        this.comments = [];
    }
}

class Comment {
    constructor( content, name, date ) {
        this.content = content;
        this.name = name;
        this.date = date;
    }
}