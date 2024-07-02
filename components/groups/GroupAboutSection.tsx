const GroupAboutSection = ({ about }: { about: string }) => (
  <section className="space-y-3 rounded-lg bg-white-100 p-5 text-white-400  dark:bg-dark-800">
    <h1 className="paragraph-2-bold text-dark-800 dark:text-white-200">
      About Group
    </h1>
    <p className="paragraph-4-regular text-white-400 dark:text-white-300">
      {about}
    </p>
  </section>
);

export default GroupAboutSection;
