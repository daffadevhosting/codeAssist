import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const projectInfo = {
  projectName: "CoDa: AI Generator",
  description: "CoDa AI adalah aplikasi web AI interaktif yang memungkinkan pengguna untuk berinteraksi dengan model AI generatif untuk menjelajahi dan mendiskusikan Code & Project. Ajukan pertanyaan tentang code / script yang error, tempel block script yang error di form input, CoDa akan menerima & memperbaiki script di percakapan.",
  repository: "https://github.com/daffadevhosting/codeAssist",
  vscodeExtension: "https://marketplace.visualstudio.com/items?itemName=DaffaDev.coda-vscode"
};

export function ProjectInfo() {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/icon.png" alt="Project Icon" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{projectInfo.projectName}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Deskripsi:</h3>
          <p className="text-sm text-muted-foreground">{projectInfo.description}</p>
        </div>
        <div>
          <h3 className="font-semibold">Repositori:</h3>
          <a href={projectInfo.repository} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
            {projectInfo.repository}
          </a>
        </div>
        <div>
          <h3 className="font-semibold">Ekstensi VS Code:</h3>
          <a href={projectInfo.vscodeExtension} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
            {projectInfo.vscodeExtension}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
