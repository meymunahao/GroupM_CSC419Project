export default function NewUser() {
  return (
    <div className="text-center mt-20">
      <img
        src="/flowers.png"
        alt="Empty feed"
        className="mx-auto rounded-xl mb-8 max-w-sm w-full"
      />

      <h1 className="text-3xl font-bold mb-3">
        Your world is waiting <br />
        <span className="text-orange-500">to be filled</span>
      </h1>

      <p className="text-gray-500 max-w-md mx-auto mb-8">
        It looks a little quiet here. Start your journey by
        following creators who inspire you or sharing your
        very first moment.
      </p>

      <div className="flex justify-center gap-4 flex-wrap">
        <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full font-semibold">
          Explore Content
        </button>
        <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full font-semibold">
          Create Post
        </button>
      </div>
    </div>
  );
}
