# Visualizing Political Leaders


## Graph Description
Our dataset is related to world leaders' information. There is a selection button on the top of the graph, which can help us select different kinds of dataset. Then, we present 3 views to show different information. Lexis chart is showing, from 1950 to 2021, each leader's term of office including each leader's start-age and end-age as well. Besides, when the mouse hover over each "arrow", a tooltip would pop out with highlighted arrow to show the basic info of that particular leader. The text on top of an arrowLine indicates the name of that leader if the label is equal to 1 in dataset.

The two bars in bar chart are showing the number of male and female leaders respectively. When clicking on the bar, scatter plot and lexis chart will change. For example, when you click on the male bar, the lexischart and scatterplot would just show you the male data. And when you click the male button again, the data will recover to original state. 

In addition, the scatter plot indicates every leader's age and also the GDP per capita in his/her term of office. There is also a tooltip to show each leader's basic info when hovering over each circle. And if you click on each circle, the selected circle would become orange and the correspond arrow would become orange as well. After double clicking the circle, everything would recover.

I have also added css style sheet to change the font-weight and hover related effects.

In order to realize the interactive effects, I add some logics in click event. The comments on each block of code should explain its meaning.

## Reference
+ Data is provided by teaching team. <br>
+ Use some data and code from prevous assignments, case studies and tutorials, such as svg element's places<br>
+ [Apply clipping mask to 'vis.chart', restricting the region at the very beginning and end of a year](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath) <br>
+ [SVG marker elements](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker) <br>

