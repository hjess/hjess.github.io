# Dad Jokes

This was a quickie project suggested for a UI Web Developer interview. The directions were:

<blockquote>
# Web Interview Project

Using any tools you prefer (Vue, React, Angular, plain ol JavaScript, CSS frameworks) let’s build a website. The website only needs to do a couple things. Primarily it is going to interact with https://icanhazdadjoke.com/api 

  * Be able to search for a joke
    * Pagination of joke search results would be nice, but not required. You might save this for last if you have time.
    * Gracefully handle the case where there are no search results

  * Be able to retrieve a random joke

  * Even though it is kind of silly, when you click a joke it should go to an individual joke page.
    * On that page you should be able to click a button to copy the joke to your clipboard.
    
  * There should be a page header and footer, with navigation to the search page, the random page, and any additional pages you feel like adding.

  * Although this is a very simple website, it should be nicely laid out and formatted. We aren’t going to judge your web design tastes, we are just looking for knowledge on how to layout the components of your site.

</blockquote>


My response to the interview:

<blockquote>
## Implementation notes

Hi! I have to admit that I don't think I fully understand the requirements, and as I worked on this (sporadically) over the weekend, I didn't try to communicate questions, and just made some assumptions.

It made sense (to me) to populate the results from the text and/or random search features *on the same page* as the form. This means that there are only two pages: the form + results page, and the dedicated *single joke* page. Full navigation didn't really feel correct in this design.

I don't know what to put in a footer; and the header is simply the &lt;h1&gt; text.

I was intrigued by the opportunity to use completely vanilla Javascript and CSS (except for using Axios rather than native browser fetch()); so there are no frameworks involved, and no build step.

The code is only *very* lightly (manually, ad hoc) tested; and there is no code providing for failure from the **icanhazdadjoke** API. Next version?

I'm hoping you'll be very gentle on the (lack of?) design, as that is not really one of my strengths.
</blockquote>
