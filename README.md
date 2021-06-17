# React Pokedex

So, this was a fun little challenge. It wasn't too difficult, but I had more trouble than I expected to with the two sets of checkboxes for types and weaknesses, and getting them to filter properly without including or excluding pokemon incorrectly.

My current solution is what I would describe as slightly messy, if functional, and things I would look to refactor with more time would be the second `useEffect` responsible for merging the type and weakness filtering. There's redundancy in there somewhere, I can feel it. Another thing to refactor would be the number of `useState` hooks. I feel it could have been done with fewer with slightly smarter code.

