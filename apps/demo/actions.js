import('helma/logging');
include('helma/webapp/response');
include('helma/webapp/continuation');

var log = helma.logging.getLogger(__name__);

export('index', 'extra_path', 'skins', 'logging', 'continuation', 'profiler');

// the main action is invoked for http://localhost:8080/
function index(req) {
    return new SkinnedResponse('skins/welcome.txt', {title: 'Welcome to Helma NG'});
}

// additional path elements are passed to the action as arguments,
// e.g. /extra.path/2008/09
function extra_path(req, year, month) {
    return new Response("Extra arguments:", year, month);
}

// demo for skins, macros, filters
function skins(req) {
    return new SkinnedResponse('skins/skins.txt', {
        title: 'Skins',
        name: 'Luisa',
        names: ['Benni', 'Emma', 'Luca', 'Selma']
    });
}

// demo for log4j logging
function logging(req) {
    if (req.params.info) {
        log.info("Hello world!");
    } else if (req.params.error) {
        try {
            foo.bar.moo;
        } catch (e) {
            log.error(e, e.rhinoException);
        }
    } else if (req.params.profile) {
        var profiler = require('helma/profiler');
        req.process = function() {
            return SkinnedResponse('skins/logging.txt', {
                title: "Logging &amp; Profiling"
            });
        }
        return profiler.handleRequest(req);
    }
    return new SkinnedResponse('skins/logging.txt', { title: "Logging &amp; Profiling" });
}

// demo for continuation support
function continuation(req) {

    var session = new ContinuationSession(req);

    if (!session.isActive()) {
        // render welcome page
        return SkinnedResponse('skins/continuation.txt', {
            session: session,
            page: "welcome",
            title: "Continuations"
        });
    }

    session.addPage("ask_name", function(req) {
        return SkinnedResponse('skins/continuation.txt', {
            session: session,
            page: session.page,
            title: "Question 1"
        })
    });

    session.addPage("ask_food", function(req) {
        if (req.isPost)
            session.data.name = req.params.name;
        return SkinnedResponse('skins/continuation.txt', {
            session: session,
            page: session.page,
            title: "Question 2"
        });
    });

    session.addPage("ask_animal", function(req) {
        if (req.isPost)
            session.data.food = req.params.food;
        return SkinnedResponse('skins/continuation.txt', {
            session: session,
            page: session.page,
            title: "Question 3"
        });
    });

    session.addPage("result", function(req) {
        if (req.isPost)
            session.data.animal = req.params.animal;
        return SkinnedResponse('skins/continuation.txt', {
            session: session,
            page: session.page,
            title: "Thank you!"
        });
    });

    return session.run();
}
