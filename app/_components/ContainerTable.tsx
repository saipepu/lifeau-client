import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ContainerTable = ({
  containers,
  handleSubmit,
}: {
  containers: any[],
  handleSubmit: ({ githubUrl }: { githubUrl: string }) => void,
}) => {
  return (
    <div className="w-full rounded-lg bg-white dark:bg-stone-950">
      <Table className="w-full">
        <TableHeader className="hidden">
        </TableHeader>
        <TableBody>
          {containers.map((container) => (
            <TableRow key={container.name}>
              <TableCell>
                <div className="max-w-[200px] flex justify-start items-center gap-1">
                  <div className="w-4 h-4 bg-white dark:bg-black rounded-full">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_1257_402)">
                      <path d="M10 0C8.68678 0 7.38642 0.258658 6.17317 0.761205C4.95991 1.26375 3.85752 2.00035 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 14.42 2.87 18.17 6.84 19.5C7.34 19.58 7.5 19.27 7.5 19V17.31C4.73 17.91 4.14 15.97 4.14 15.97C3.68 14.81 3.03 14.5 3.03 14.5C2.12 13.88 3.1 13.9 3.1 13.9C4.1 13.97 4.63 14.93 4.63 14.93C5.5 16.45 6.97 16 7.54 15.76C7.63 15.11 7.89 14.67 8.17 14.42C5.95 14.17 3.62 13.31 3.62 9.5C3.62 8.39 4 7.5 4.65 6.79C4.55 6.54 4.2 5.5 4.75 4.15C4.75 4.15 5.59 3.88 7.5 5.17C8.29 4.95 9.15 4.84 10 4.84C10.85 4.84 11.71 4.95 12.5 5.17C14.41 3.88 15.25 4.15 15.25 4.15C15.8 5.5 15.45 6.54 15.35 6.79C16 7.5 16.38 8.39 16.38 9.5C16.38 13.32 14.04 14.16 11.81 14.41C12.17 14.72 12.5 15.33 12.5 16.26V19C12.5 19.27 12.66 19.59 13.17 19.5C17.14 18.16 20 14.42 20 10C20 8.68678 19.7413 7.38642 19.2388 6.17317C18.7362 4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0401 1.26375 13.8268 0.761205C12.6136 0.258658 11.3132 0 10 0Z" fill="currentColor"
                        className="text-black dark:text-white"
                      />
                      </g>
                      <defs>
                      <clipPath id="clip0_1257_402">
                      <rect width="20" height="19.5155" fill="white"/>
                      </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <p className="text-sm whitespace-nowrap w-full overflow-x-scroll">
                    {container.name}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <a href={container.html_url} className="hover:underline whitespace-nowrap">
                  git.repo 📎
                </a>
              </TableCell>
              <TableCell className="flex justify-end items-center">
                <Button className='h-8' onClick={() => {
                  console.log(container.html_url, "container.html_url");
                  handleSubmit({ githubUrl: container.html_url });
                }}>
                  Import
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ContainerTable