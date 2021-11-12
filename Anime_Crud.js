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
    let post1 = new Topic( "I believe Steins:Gate is the best non-action Anime", new Date().toISOString().substring( 0,10 ) );
    let comment1 = new Comment( "I would agree but it may be to slow and dialogue based for some.", "Dehughes", new Date().toISOString().substring( 0,10 ) );
    post1.comments.push( comment1 );
    console.log( post1 );
    myPost( baseUrl, post1 )
    .then( ( resp ) => console.log( resp ) );
}

// Entity Layer

class Topic {
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

    static deleteTopic( id ) {
        return $.ajax( {
            url: baseUrl + `/${id}`,
            type: "DELETE"
        });
    }

    static createTopic( name, date ) {
        let newTopic = new Topic( name, date );
        return myPost( baseUrl, newTopic);
    }

    static editComment() {

    }
}

class DOMManager {
    static topics; // JSON array of literal objects

    // Read Function
    static getAllTopics() {
        ForumService.getAllTopics().then(
            (topics) => this.render( topics )
        );
    }

    // Create Topic Function
    static createTopic( name, date ) {
        ForumService.createTopic( new Topic(name, date) ).then( () => {
            return ForumService.getAllTopics();
        })
        .then( (topics) => this.render(topics) );
    }

    // Update Topic Function
    static updateTopic( id ) {
        ForumService.updateTopic(id).then( () => {
            return ForumService.getAllTopics();
        })
        .then( (topics) => this.render(topics) );
    }

    // Delete  Topic Function
    static deleteTopic( id ) {
        ForumService.deleteTopic(id).then( () => {
        return ForumService.getAllTopics();
        })
        .then( (topics) => this.render(topics) );
    }

    //Function grabs id from button dropdown when pressed and calls deleteTopic()
    static deleteTopicBtn( idx ) {
        let id = $(`#listing tr[idx=topic-${idx}]`).find("a[id*='delete-topic']").attr('id').split("-")[ 2 ];
        DOMManager.deleteTopic( id );
    }

    //working on this
    static deleteCommentBtn( tIdx, cIdx ){
        let id = $(`#listing tr[idx=topic-${tIdx}-comment-${cIdx}]`).find("a[id*='delete-comment']").attr('id').split("-")[ 2 ];
        
    }


    static render( topics ) { // topics is an array of literal objects returned by the API call
        this.topics = topics;
        let listing = $( "#listing" );
        listing.empty();

        //this will render our <th>'s every time we render
        listing.append(`
            <tr id="th">
                <th id="index-col">#</th>
                <th id="topic-col">Topic</th>
                <th id="replies-col">Replies</th>
                <th id="lastpost-col">Last Post</th>
                <th id="edit-col"></th>
            </tr>
        `);               

        //this for-in loop will render our <tr>'s for both our topics as well as it's comments associated.
        for( let topicIdx in this.topics ) {
            let topic = this.topics[ topicIdx ];
            let topicRow = $(`
                <tr idx='topic-${topicIdx}'>
                    <td id='topic-index'>${( parseInt(topicIdx) + 1 )}</td>
                    <td id='topic-title'>${topic.name}</td>
                    <td id='topic-replies'>${topic.replies}</td>
                    <td id='topic-date-posted'>${topic.date}</td>
                    <td>
                        <div class='btn-group'>
                            <button type='button' class='btn btn-secondary dropdown-toggle btn-sm' data-bs-toggle='dropdown'>Edit</button>
                            <div class='dropdown-menu'>
                                <a href='#' class='dropdown-item' id='add-comment' onclick='#(); return false;'>Comment</a>
                                <a href='#' class='dropdown-item' id='delete-topic-${topic._id}' onclick='DOMManager.deleteTopicBtn( ${topicIdx} ); return false;'>Delete Topic</a>
                            </div>
                        </div>
                    </td>
                </tr>`);

            listing.append( topicRow );
            
            for( let cmntIdx in topic.comments ) {
                let comment = topic.comments[ cmntIdx ];
                let commentRow = $(`
                    <tr idx='topic-${topicIdx}-comment-${cmntIdx}'>
                        <td id='comment-index'>Comment ${( parseInt(cmntIdx) + 1 )}:</td>
                        <td colspan='2' id='comment-content'>${comment.content}</td>
                        <td id='comment-date-posted'>by: ${comment.user} >> ${comment.date}</td>
                        <td>
                        <div class='btn-group'>
                            <button type='button' class='btn btn-secondary dropdown-toggle btn-sm' data-bs-toggle='dropdown'>Edit</button>
                            <div class='dropdown-menu'>
                                <a href='#' class='dropdown-item' id='edit-comment-${topic._id}' onclick='#(); return false;'>Edit Comment</a>
                                <a href='#' class='dropdown-item' id='delete-comment-${topic._id}' onclick='DOMManager.deleteCommentBtn( ${topicIdx}, ${cmntIdx} ); return false;'>Delete Comment</a>
                            </div>
                        </div>
                        </td>
                    </tr>`);

                listing.append( commentRow );

            }
        }
    }
}

$( () => {
    //call getAllTopics()
    DOMManager.getAllTopics();
   });