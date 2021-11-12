// Primitives

// CHANGE ME PER DAY AND CALL makeInitial() to populate!
const baseUrl = "https://crudcrud.com/api/630f721a0b2449abb595eb3993b8c21a/animeforumpost";

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
    constructor( content, user, date ) {
        this.content = content;
        this.user = user;
        this.date = date;
    }
}

class ForumService {

    static getAllTopics() {
        return $.get( baseUrl );
    }
}

class DOMManager {
    static topics; // JSON array of literal objects

    static getAllTopics() {
        ForumService.getAllTopics().then(
            (topics) => this.render( topics )
        );
    }

    static createTopic( name , date ) {

    }

    static deleteTopic( id ) {

    }

    static render( topics ) { // topics is an array of literal objects returned by the API call
        this.topics = topics;
        let listing = $( "listing" );
        listing.empty();

        for( let topicIdx in this.topics ) {
            let topic = this.topics[ topicIdx ];
            let topicRow = $(`
            <div idx='${topicIdx}'>
                <tr>
                    <td>${topicIdx + 1}</td>
                    <td>${topic.name}</td>
                    <td>${topic.replies}</td>
                    <td>${topic.date}</td>
                    <td>
                        <div class='btn-group'>
                            <button type='button' class='btn btn-secondary dropdown-toggle btn-sm' data-bs-toggle='dropdown'>Edit</button>
                            <div class='dropdown-menu'>
                                <a href='#' class='dropdown-item' id='add-comment' onclick='#(); return false;'>Comment</a>
                                <a href='#' class='dropdown-item' id='delete-topic-${topic._id}' onclick='#(); return false;'>Delete Topic</a>
                            </div>
                        </div>
                    </td>
                </tr>
            </div>`
            );

            listing.append( topicRow );
            
            for( let cmntIdx in topic.comments ) {
                let comment = topic.comments[ cmntIdx ];
                let commentRow = $(`
                <div idx='${cmntIdx}'>
                    <tr>
                        <td>Comment ${cmntIdx + 1}:</td>
                        <td colspan='2'>${comment.content}</td>
                        <td>by: ${comment.user} >> ${comment.date}</td>
                        <td>
                        <div class='btn-group'>
                            <button type='button' class='btn btn-secondary dropdown-toggle btn-sm' data-bs-toggle='dropdown'>Edit</button>
                            <div class='dropdown-menu'>
                                <a href='#' class='dropdown-item' id='edit-comment-${comment._id}' onclick='#(); return false;'>Edit Comment</a>
                                <a href='#' class='dropdown-item' id='delete-comment-${comment._id}' onclick='#(); return false;'>Delete Comment</a>
                            </div>
                        </div>
                        </td>
                    </tr>
                </div>
                `);

                listing.append( commentRow );

            }

        }

    }
}

//$( () => {
    //call getAllTopics()
   // DOMManager.getAllTopics();
//});