School project in collaboration with a real company. The idea: let users import raw data, build templates around it through a visual editor, and send the result straight to a printer.

The backend ran on Spring Boot Java, which was new territory for us. Most of our experience was in TypeScript, so the first week was mostly spent trying to understand what we were even looking at. Dependency injection, controllers, repositories, a codebase we hadn't built ourselves. It was a lot to take in before we could even think about writing features.

We started with a company introduction, got access to the codebase, and immediately hit a wall. Our lecturer had given us the wrong password, and on top of that we discovered a missing header in the database that was blocking everything. Before we could write a single line of feature code, we were already debugging infrastructure.

I got to work on every piece of the project but spent most of my time on the templates section. That meant building the overview page where users could see, filter, and manage their templates.

Getting that page to actually work took longer than expected. The API call was broken in a way that was hard to pin down: different behavior on every machine in the team. I went through everything systematically, tested through Swagger, compared environments, and eventually found the issue. Nobody had noticed a missing header.

The next step was the template creation flow itself. I had the modal built but ran out of time before I could get the POST call working correctly. Feedback from our lecturer was minimal throughout, so a lot of it felt like figuring things out blind. Not the smoothest project, but I learned more from the things that broke than from the things that worked.