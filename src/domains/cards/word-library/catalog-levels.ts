import type { WordLibraryLevel } from './catalog';

/**
 * Difficulty level of every catalog entry, kept apart from the seed rows.
 *
 * Criteria (judged for Spanish speakers, not copied from any external list):
 * - basic: very frequent, concrete, everyday words and short fixed phrases.
 * - intermediate: common but more abstract words, phrasal verbs, and
 *   multi-word expressions that need some context.
 * - advanced: specialised or abstract vocabulary, idiomatic or register-bound
 *   language, and long polite or discursive sentence frames.
 *
 * Entries are listed by slug per category; the id is `<categoryId>-<slug>`.
 */
type LevelSlugs = Record<WordLibraryLevel, string>;

const WORK_LEVELS: LevelSlugs = {
  basic: `
      coworker manager supervisor teammate department workplace promotion
      presentation workshop feedback announcement deadline contract invoice
      spreadsheet draft attachment process resource priority issue colleague
      job-opening candidate interview resume salary benefit budget expense
      client customer account discount customer-service complaint refund
      schedule complete deliver review approve overtime flexible-hours
      annual-leave sick-leave remote-work backup dashboard inventory shipment
      warehouse mentor time-zone business-hours out-of-office
  `,
  intermediate: `
      headquarters responsibility workload agenda meeting-minutes briefing
      conference-call check-in follow-up milestone proposal estimate workflow
      procedure capacity scope risk blocker collaboration partnership
      contribution initiative onboarding orientation cover-letter
      qualification performance-review career-path payroll reimbursement
      revenue forecast purchase-order sales-target lead prospect quotation
      renewal account-manager competitor campaign prioritize reschedule
      postpone revise clarify summarize negotiate resolve investigate monitor
      track analyze measure launch flag take-notes get-approval
      keep-someone-posted run-behind-schedule ahead-of-schedule
      meet-a-deadline hybrid-schedule work-life-balance company-policy
      confidential-information password-manager support-ticket bug-report
      release-notes source-code user-interface feature-request test-case
      deployment analytics invoice-number payment-terms timesheet
      expense-report vendor supplier workplace-safety safety-briefing hazard
      first-aid notice-period resignation mentorship on-call availability
      action-item
  `,
  advanced: `
      deliverable consensus decision-maker stakeholder ownership handoff
      profit-margin user-research market-share brand-awareness conversion-rate
      sales-pipeline delegate roll-out scale-up streamline address escalate
      follow-through hand-over circle-back be-on-the-same-page touch-base
      work-around take-ownership code-of-conduct compliance data-breach
      product-roadmap version-control quality-assurance service-outage uptime
      maintenance-window integration quarterly-results annual-report
      board-meeting return-on-investment business-case operating-cost
      cash-flow profitability procurement logistics incident-report
      probation-period exit-interview succession-plan professional-development
      cross-functional after-action-review
  `
};

const TRAVEL_LEVELS: LevelSlugs = {
  basic: `
      airport boarding-pass departure arrival one-way-ticket round-trip-ticket
      aisle-seat window-seat carry-on checked-baggage baggage-claim customs
      flight-attendant pilot takeoff landing visa passport hotel hostel
      front-desk reservation room-key reception lobby elevator suite
      air-conditioning heating swimming-pool breakfast-buffet rental-car
      driver taxi bus-stop subway platform train-station ferry port highway
      traffic-light street-map gps route fare city-center downtown landmark
      guided-tour brochure opening-hours sightseeing cathedral castle palace
      national-park atm exchange-rate travel-adapter suitcase backpack
      restaurant-reservation local-cuisine street-food food-stall
      vegetarian-option boat-trip snorkeling
  `,
  intermediate: `
      terminal departure-board boarding-time layover connecting-flight
      nonstop-flight overhead-bin luggage-tag carousel security-checkpoint
      turbulence runway gate-change flight-number airline itinerary
      flight-delay resort campsite vacation-rental check-in-time checkout-time
      key-card concierge housekeeping room-service wake-up-call
      luggage-storage double-room twin-room non-smoking-room minibar
      kitchenette balcony wi-fi-password toiletries early-check-in car-rental
      rideshare shuttle-bus bus-station metro-card tram cruise-ship
      bicycle-rental bike-lane scooter parking-garage gas-station fuel
      intersection pedestrian-crossing crosswalk road-sign navigation-app
      ticket-machine day-pass old-town walking-tour city-pass entrance-fee
      day-trip monument temple hiking-trail waterfront pier local-market
      currency-exchange local-currency first-aid-kit luggage-lock money-belt
      travel-pillow packing-list toiletry-bag lost-luggage travel-companion
      solo-travel group-tour market-hall dietary-restriction happy-hour
      surf-lesson kayak-rental overnight-train
  `,
  advanced: `
      immigration passport-control travel-document flight-cancellation
      missed-connection apartment-rental booking-reference accessible-room
      safe-deposit-box late-checkout cancellation-policy refundable-rate
      airport-transfer commuter-train ferry-terminal harbor detour
      transit-pass historic-district tourist-information-center
      scenic-overlook observation-deck ruins archaeological-site
      nature-reserve trailhead scenic-route beach-access boardwalk marina
      travel-insurance emergency-contact consulate embassy travel-advisory
      travel-clinic vaccination-record weight-limit baggage-allowance set-menu
      tasting-menu service-charge eco-tour wildlife-tour scuba-diving
  `
};

const DAILY_LEVELS: LevelSlugs = {
  basic: `
      wake-up get-dressed make-the-bed take-a-shower brush-your-teeth
      wash-your-face have-breakfast pack-a-lunch leave-home lock-the-door
      take-out-the-trash do-laundry fold-clothes wash-the-dishes vacuum
      water-the-plants feed-the-cat walk-the-dog grocery-list grocery-store
      shopping-cart detergent faucet sink front-door living-room frying-pan
      oven microwave toaster kettle coffee-maker refrigerator freezer recipe
      snack water-bottle mug dinner-plate fork spoon napkin bedroom blanket
      alarm-clock curtains doorbell mailbox backyard houseplant sofa armchair
      coffee-table dining-table toilet-paper hand-soap toothbrush toothpaste
      headache sore-throat cough fever runny-nose dentist pharmacy post-office
      hairdresser weather-forecast umbrella raincoat sweater daylight sunset
      take-a-nap
  `,
  intermediate: `
      commute hang-the-laundry load-the-dishwasher sweep-the-floor
      mop-the-floor dust-the-shelves clean-up tidy-up run-errands
      checkout-line reusable-bag laundry-basket vacuum-cleaner broom mop
      dish-soap paper-towel light-bulb bathroom-mirror pantry cupboard
      countertop cutting-board saucepan cooking-pot blender leftovers
      ingredient mixing-bowl chopsticks trash-bag fresh-produce frozen-food
      wardrobe hanger mattress key-ring staircase lawn plant-pot drawer
      bookcase desk-lamp laundry-room allergy prescription pharmacist
      appointment waiting-room checkup thermometer bandage clinic neighborhood
      convenience-store parcel delivery barber-shop public-library
      make-an-appointment
  `,
  advanced: `
      sort-recycling drying-rack extension-cord drain shower-curtain
      chef-s-knife baking-sheet oven-mitt stovetop food-processor serving
      portion meal-prep thermos tablecloth dish-rack sink-plug compost-bin
      food-scraps expiration-date canned-goods dairy-aisle bakery-section
      grocery-receipt bedside-table dresser bedsheet pillowcase duvet
      bedside-lamp blinds windowsill spare-key apartment-building handrail
      doormat shoe-rack coat-hanger umbrella-stand entryway patio fence
      garden-hose watering-can storage-box bathroom-cabinet dental-floss
      blood-pressure pain-reliever health-insurance eye-exam optician
      laundromat tailor dry-cleaner repair-shop hardware-store
      return-a-package pick-up-a-parcel pay-a-bill queue-up rubber-boots
      rain-shower heat-wave cold-snap change-the-sheets
  `
};

const PHRASES_LEVELS: LevelSlugs = {
  basic: `
      by-the-way how-have-you-been it-is-nice-to-meet-you long-time-no-see
      where-are-you-from what-do-you-do how-was-your-weekend
      it-is-good-to-see-you please-call-me my-name-is you-can-call-me
      this-is-my-friend is-this-seat-taken i-have-to-get-going
      it-was-lovely-meeting-you thanks-for-stopping-by i-will-see-you-around
      could-you-give-me-a-hand may-i-borrow-your-charger
      can-i-get-a-glass-of-water could-i-have-a-receipt
      would-you-like-some-help i-appreciate-your-help no-trouble-at-all
      it-is-no-problem i-can-do-that one-moment-please just-a-second
      could-you-repeat-that speak-a-little-slower how-do-you-spell-that
      what-does-that-mean what-is-the-word-for how-do-you-pronounce
      i-did-not-catch-that i-am-following-you sorry-i-am-late my-mistake
      i-am-sorry-to-hear-that no-worries do-not-worry-about-it
      i-am-running-late that-works-for-me that-does-not-work-for-me
      how-about-this i-agree-with-you that-makes-sense go-ahead after-you
      for-example to-be-honest i-have-no-idea i-will-be-there-in-a-minute
      take-care
  `,
  intermediate: `
      what-brings-you-here have-we-met-before i-have-heard-a-lot-about-you
      how-is-everything-going how-is-your-family what-have-you-been-up-to
      i-am-visiting-from i-live-just-around-the-corner mind-if-i-join-you
      it-has-been-a-while what-a-pleasant-surprise thanks-for-having-me
      let-us-keep-in-touch say-hello-to-everyone how-do-you-know-each-other
      are-you-from-around-here i-am-here-for-the-first-time what-a-small-world
      it-is-great-to-finally-meet-you i-hope-you-are-doing-well
      how-is-your-day-going it-is-nice-to-be-here i-am-glad-you-could-make-it
      please-make-yourself-at-home i-am-happy-to-be-here
      it-is-good-to-finally-meet-in-person do-you-come-here-often
      what-do-you-think-of-the-place how-did-you-hear-about-this
      it-has-been-a-pleasure would-you-mind-opening-the-window
      could-i-ask-you-a-question can-you-show-me-how-it-works
      could-we-try-again let-me-know-if-you-need-anything
      thank-you-for-your-patience that-is-very-kind-of-you
      thanks-for-letting-me-know i-owe-you-one i-would-be-happy-to
      i-would-rather-not i-am-afraid-i-cannot let-me-check-first
      i-will-take-care-of-it could-you-write-it-down
      i-am-not-sure-i-understand are-you-saying-that sorry-to-keep-you-waiting
      i-did-not-mean-to-interrupt that-is-my-fault thanks-for-understanding
      i-am-sorry-that-happened i-hope-things-get-better it-happens-to-everyone
      let-us-start-over can-we-take-a-break can-we-talk-about-something-else
      i-need-a-minute let-me-think-about-it i-will-get-back-to-you
      i-will-let-you-know i-will-find-out i-am-working-on-it
      i-might-be-a-few-minutes-late i-cannot-make-it-today i-have-to-cancel
      can-we-reschedule i-am-available-after i-am-free-on what-time-suits-you
      what-if-we why-do-not-we we-could-also i-see-your-point
      i-am-with-you-on-that i-am-not-so-sure-about-that i-am-all-ears
      in-other-words i-will-think-it-over it-is-up-to-you
      that-is-a-good-question did-i-get-that-right are-we-still-on-for
  `,
  advanced: `
      i-do-not-think-we-have-met i-have-been-meaning-to-call-you
      we-have-a-mutual-friend i-recognize-your-name would-it-be-possible-to
      feel-free-to-reach-out whenever-you-have-a-moment at-your-convenience
      leave-it-with-me i-will-see-what-i-can-do could-you-say-that-another-way
      could-you-explain-a-little-more what-do-you-mean-by
      let-me-make-sure-i-understand if-i-understand-correctly so-you-mean-that
      can-i-clarify-something i-apologize-for-the-mix-up
      i-need-some-time-to-think give-me-a-moment-to-think
      i-will-keep-that-in-mind i-do-not-have-an-answer-yet
      we-are-looking-into-it there-has-been-a-delay something-came-up
      could-we-move-it is-another-time-better can-we-meet-halfway
      i-suggest-that i-am-not-convinced from-my-point-of-view as-far-as-i-know
      as-far-as-i-can-tell in-my-experience that-sounds-reasonable
      i-have-a-different-view we-may-have-to-agree-to-disagree
      i-would-look-at-it-differently the-way-i-see-it
      i-would-like-to-add-something can-i-jump-in-here if-i-may-add
      please-carry-on let-us-stay-on-topic that-is-beside-the-point
      let-us-get-back-to before-we-move-on to-put-it-simply on-the-other-hand
      at-the-same-time as-a-result truth-be-told i-have-not-made-up-my-mind
      it-depends-on-the-situation whatever-works-best i-am-glad-you-asked
      let-me-put-it-this-way i-am-trying-to-say the-main-point-is
      that-is-not-what-i-meant i-may-have-misunderstood have-i-got-this-right
      could-you-clarify-one-thing
  `
};

const LEVELS_BY_CATEGORY_ID = {
  work: WORK_LEVELS,
  travel: TRAVEL_LEVELS,
  daily: DAILY_LEVELS,
  phrases: PHRASES_LEVELS
} as const;

/** Entry id to level, built once from the lists above. */
export const wordLibraryLevelById: Readonly<Record<string, WordLibraryLevel>> =
  Object.fromEntries(
    Object.entries(LEVELS_BY_CATEGORY_ID).flatMap(([categoryId, levels]) =>
      Object.entries(levels).flatMap(([level, slugs]) =>
        slugs
          .trim()
          .split(/\s+/)
          .map(slug => [`${categoryId}-${slug}`, level as WordLibraryLevel])
      )
    )
  );
