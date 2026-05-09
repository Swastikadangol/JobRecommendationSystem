AuthContext is used for:

knowing who is logged in
showing correct dashboard:
JobSeeker
Employer
Admin
protecting routes
logout system


jssidebar
fixed → sidebar stays fixed on the screen (doesn’t scroll)
inset-y-0 → stretches from top to bottom
left-0 → sticks to the left side
w-60 → width of sidebar
bg-white → white background
border-r → right border
flex flex-col → stack items vertically
transition-transform duration-200 ease-in-out - used to move sidebar smoothly
how long the animation takes
ease-in-out : controls the speed curve of the animation

${open ? 'translate-x-0' : '-translate-x-full'} : open = true → translate-x-0 → sidebar visible
open = false → -translate-x-full → sidebar hidden (moved left)
