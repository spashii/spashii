import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    // center the spinner
    <div className="flex justify-center items-center h-full">
      <Spinner />
    </div>
  );
}
