# is308-final-proj
## Description
A website in development meant to visualize enrollment statistics for the University of Illinois Urbana-Champaign by race. Inspired by Dave Musselman's Unessay assignment (IS 308, SP23). This website aims to provide clean, customizable data visualizations of University of Illinois: Urbana-Champaign (UIUC) enrollment statistics by race, broken down into two subpages:
- Granular: Specific to a unique combination ofterm, school, and student level
- Cumulative: Time-series specific to semester (fall, spring, or summer) and student level

CSVs in `data/` fetched from https://www.dmi.illinois.edu/ through `scripts/`.

Heavily powered by Chart.Js
## Future Development Considerations:
- Cumulative page has some missing data (Multiracial and Hawaiian / Pacific Isl. not reported pre 2010)
- Granular page is only 2017 - 2023 currently. If rest of years are added, dropdown select gets somewhat messy. 