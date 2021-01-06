$(document).ready(function () {
  // get the date from moment
  var now = moment().format("MMMM Do, YYYY");

  // get the time from moment
  var nowHour24 = moment().format("H");

  // Target <p> with date and put it on the page
  var headingDate = $("#currentDay");
  headingDate.text(now);

  // Get stored items from localStorage
  var storedPlans = JSON.parse(localStorage.getItem("storedPlans"));

  // If plans were retrieved from localStorage, update the plan array to it
  if (storedPlans !== null) {
    planTextArr = storedPlans;
  } else {
    // this should only occur on first time the app is loaded in the browser
    planTextArr = new Array(24);
  }

  // set variable referencing planner element
  var plannerContainer = $("#plannerContainer");
  // clear existing elements
  plannerContainer.empty();

  // build calendar by row for fix set of hours
  for (var hour = 0; hour <= 23; hour++) {
    // index for array use offset from hour
    var index = hour - 9;

    // build row components
    var createDivRow = $("<div>");
    createDivRow.addClass("row");
    createDivRow.attr("data-index", hour);

    // Time Box colum
    var timeColDiv = $("<div>");
    timeColDiv.addClass("col-md-2");

    // create time-block element (holds time)
    var timeSpan = $("<span>");
    // can use this to get value
    timeSpan.attr("class", "time-block");

    // format hours for display
    var displayHour = 0;
    var amOrPm = "";

    if (hour === 0) {
      //if it is midnight
      displayHour = hour + 12;
      amOrPm = "am";
    } else if (hour > 12) {
      displayHour = hour - 12;
      amOrPm = "pm";
    } else if (hour === 12) {
      // if it is noon
      displayHour = hour;
      amOrPm = "pm";
    } else {
      displayHour = hour;
      amOrPm = "am";
    }

    // populate timeBlock with time
    timeSpan.text(`${displayHour} ${amOrPm}`);

    // insert into col inset into timeBlock
    createDivRow.append(timeColDiv);
    timeColDiv.append(timeSpan);
    // STOP building Time box portion of row

    // START building textarea portion of row
    // build row components
    var textarea = $("<textarea>");

    textarea.attr("id", `input-${index}`);
    textarea.attr("data-index", index);
    textarea.attr("type", "text");
    textarea.attr("class", "description");

    // access index from data array for hour
    textarea.val(planTextArr[index]);

    // create div to hold textarea and set col
    var holdTextareaDiv = $("<div>");
    holdTextareaDiv.addClass("col-md-9");

    // add col width and row component to row
    holdTextareaDiv.append(textarea);
    createDivRow.append(holdTextareaDiv);
    // STOP building Time box portion of row

    // create div to hold save icon and set col
    var saveDiv = $("<div>");
    saveDiv.addClass("col-md-1");

    // create image for 'fontawesome' and set classes
    var iSaveBtn = $("<i>");
    iSaveBtn.attr("id", `saveid-${index}`);
    iSaveBtn.attr("data-save", index);
    iSaveBtn.attr("class", "far fa-save saveBtn");

    // add save btn to save div
    saveDiv.append(iSaveBtn);
    // add save btn div to div row
    createDivRow.append(saveDiv);

    // adjust row color to pas present or future
    updateRowColor(createDivRow, hour);

    // add row to planner container
    plannerContainer.append(createDivRow);
  }

  // function to update row color
  function updateRowColor(divRow, hour) {
    if (hour < nowHour24) {
      $(divRow).addClass("past");
    } else if (hour > nowHour24) {
      $(divRow).addClass("future");
    } else {
      $(divRow).addClass("present");
    }
  }

  // saves to local storage
  // on click function to listen for user clicks on plan area
  $(document).on("click", "i", function (event) {
    event.preventDefault();

    var dataSave = $(this).attr("data-save");

    var inputId = `#input-${dataSave}`;
    var value = $(inputId).val();

    planTextArr[dataSave] = value;
    localStorage.setItem("storedPlans", JSON.stringify(planTextArr));
  });
});
