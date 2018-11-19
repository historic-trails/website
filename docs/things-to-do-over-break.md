---
title: Sample Essay
author: Fred Gibbs
layout: single-col
date: 2018-11-19
---

# What to do over Thanksgiving break
I was way unclear at the end of class on Monday, but wanted to at least show you the basics of what you need to do for Monday. Below I've written out clear steps to follow to get everything done.

Your main task for MONDAY is to get your essays into our website folder and get your images (at least 3, but try for more) to work.

HOWEVER, you also have a major deadline on WEDNESDAY, so you should really try to have Wednesday's assignment done by Monday in case there are problems and we can solve them during class. See the syllabus for details about what needs to be done by WEDNESDAY.

**PRO TIP: Work carefully! Avoiding problems takes MUCH less time than tracking them down and fixing them.**


### FOR MONDAY: Here's the minimum of what you need to do:

## Find images using techniques Guy covered in class.
When you download the image, please rename it so it has a human-readable name, not something like `IMG00382717-2.jpg`. It is much easier to solve problems when the file names are descriptive, like `little-blue-river.jpg`. All files in our images folder should have consistent and nicely-formatted names. This means all lower case with hyphens instead of spaces.

## Revise your essays in preparation for Wednesday's deadline.
Don't worry about any code at this point. Just make sure the essay is done, with section headings, clear topic sentences, and focused paragraphs.


# Getting your webpage to work

## Add necessary Metadata to the top of your essay.
All essays must have the following metadata at the very top of your Markdown file, with the title and author customized to your essay. This is what will turn our basic Markdown files into web pages. **Be sure you have the 3 hyphens `---` before and after your metadata on their own lines**. The top of your essay page should look like:

``` markdown
---
title: Blue Mills
author: Fred Gibbs
layout: single-col
date: 2018-11-19
---

```

Copy and paste the above code into the VERY TOP of your file. Avoid blank lines and spaces before this code. Make sure there is at least one blank line after the bottom `---`.


## Commit your file to the repository.
Put your file in the new [docs/sites folder](https://github.com/historic-trails/santa-fe-itinerary/tree/master/docs/sites). Like always, you can drag and drop your Markdown file onto that page, use the `Upload files` button and select your file, or you can use the `Create a new file` button and copy and paste your text into the text box.

## Do something else for a while
Wait about 10 minutes so GitHub can build your new webpage.

## Check to see if your NEW WEB PAGE page looks OK.
Then, in your URL bar, type in:
`https://historic-trails.github.io/santa-fe-itinerary/sites/blue-mills`. Or you can just [open this link in a new window](https://historic-trails.github.io/santa-fe-itinerary/sites/blue-mills).  Then replace `blue-mills` with the name of your file. Your page should look vaguely like the [Blue Mills Sample](https://historic-trails.github.io/santa-fe-itinerary/sites/blue-mills). **KEEP YOUR PAGE OPEN IN YOUR BROWSER TAB!**


# Adding Images

## Upload your images to [our images directory](https://github.com/historic-trails/santa-fe-itinerary/tree/master/docs/sites/images)
Remember they should have nice filenames at this point.


## Edit your essays to make images appear.
Just like in class, copy and paste the code below into your essay _wherever you want the image to appear_.

Remember that this technique is totally different from how you learned to do images in Markdown itself. This is because if we want to maintain consistency across images and pages, like how the captions appear, we need a bit of extra HTML than Markdown alone can provide. We want our essays to look like this:

---

{% include figure.html class="img-right" width="33%" caption="Centennial Hotel" src="images/centennial-hotel.jpg" %}

Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum.

---


To insert the above image, copy this code to your Markdown file:
```
{%raw%}{% include figure.html
  class="img-right"
  width="33%"
  caption="Centennial Hotel"
  src="images/centennial-hotel.jpg"
%}{%endraw%}
```


## Edit the `src` field
In the code you copied to your essay, change what's between the quotes in the `src` field to match the filename of your image. Note that EVERYONE will have `images/` as the first part of the their filename because we're all putting our images in the images directory. YAY LOGIC! My file is a `.jpg` file; yours might be `.png` or something else. Make sure what's in the code and your file name as it appears in the repository MATCH EXACTLY.

## Commit your changes.
Just like above, there are several ways to do this depending on how you prefer to work.

## Check your work
Wait a few minutes (should be less time than before), then reload/refresh your essay's webpage (the tab from earlier that you kept open). Your images should appear, but if they do not, either you need to wait a little longer or you made a mistake with the code. If you've waited more than 5 minutes, you probably made a silly typo somewhere and you have to find it.

### Troubleshooting
- Most common problem is a mismatch between image filename and what you put in the code.
- Double check your code against the model for a missing quote or bracket.
- Make sure your files are in the `docs/sites/images` folder on GitHub.


## Update our Site List
Visit our [List Page](https://github.com/historic-trails/santa-fe-itinerary/blob/master/docs/list.md), click the pencil icon, and update your site name so that it's a link to your new webpage. Note that I've already done that for Blue Mills, so you just need to imitate what I've done. This way we have an easy way to access our pages without having to type in URLs all the time.

## Consult the sample if need be
Remember that the [Blue Mills file](https://github.com/historic-trails/santa-fe-itinerary/blob/master/docs/sites/blue-mills.md) has everything you need to emulate already in it. So if you're unclear about something, check the code for that page by clicking the `raw` button on top of the edit box. You can also copy and paste from the raw output into your own file. It's exactly the same code as described above.

## You're done!
It wasn't so bad, was it? Unless you made a silly typo somewhere and spent a long time trying to find it---then it probably was pretty bad. But don't say I didn't warn you.

## Remember your WEDNESDAY DEADLINE
You took a big step here, but there's a lot that needs to get done for Wednesday, so please start working on these over our extended break. That's what the extra time is for!

## That said, don't work too hard
Enjoy the FOOD HOLIDAY! See you Monday morning!
